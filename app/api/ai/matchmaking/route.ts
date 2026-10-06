import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verificação de Autenticação Segura
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const clientId = payload.sub as string;

    const body = await request.json();
    const { title, description, tokensValue, rejectedIds, userId } = body;

    let finalDescription = description;
    const targetClientId = userId || clientId;

    const vault = await prisma.brandVault.findFirst({
      where: { clientId: targetClientId },
      orderBy: { createdAt: 'desc' }
    });
    if (vault && vault.content) {
      finalDescription += `\n\n=== DIRETRIZES DE MARCA (BRAND VAULT) ===\n${vault.content}\n=========================================\n* Siga essas diretrizes estritamente durante a execução do Job.`;
    }

    const brandVibe = vault && vault.content ? vault.content : "Marca padrão, sem manual cadastrado.";

    // 2. Cria o Job no Banco como Status 'matching'
    const job = await prisma.job.create({
      data: {
        title,
        description: finalDescription,
        tokensValue: tokensValue || 10,
        status: 'matching',
        clientId: clientId
      }
    });



    // 4. Puxa todos os Criativos disponíveis COM o contexto de performance, patentes, carga de trabalho e histórico
    const availableCreatives = await prisma.user.findMany({
      where: { 
        role: 'criativo',
        id: { notIn: rejectedIds || [] }
      },
      select: { 
        id: true, 
        name: true,
        rank: true, // novato ou veterano
        ratingScore: true, // SLA
        reviewsCount: true,
        activeCategories: true, // As categorias marcadas pelo radar
        _count: {
          select: {
            jobsAsCreative: {
              where: {
                status: {
                  in: ['pending_accept', 'active', 'reviewing']
                }
              }
            }
          }
        },
        jobsAsCreative: {
          where: { title }, // Puxa histórico desse criativo para ESTA exata categoria (título)
          select: { id: true }
        }
      }
    });

    if (availableCreatives.length === 0) {
      return NextResponse.json({ error: 'Nenhum criativo disponível na rede no momento.' }, { status: 404 });
    }

    let selectedCreativeId = availableCreatives[0].id; // Fallback
    let matchmakingReason = "Alocação automática via SLA.";

    // ALGORITMO DE MATCHMAKING DETERMINÍSTICO APERFEIÇOADO
    // Calcula um "Score de Match" para cada criativo baseado em SLA, experiência, carga de trabalho, chance e afinidade
    const scoredCreatives = availableCreatives.map(creative => {
      let score = 0;
      
      // 1. Peso SLA (Até 50 pontos)
      score += (creative.ratingScore || 0) * 10;
      
      // 2. Peso Experiência na Plataforma (Até 20 pontos)
      // Cada review conta como 1 ponto, limitado a 20 pontos
      score += Math.min((creative.reviewsCount || 0), 20);
      
      // 3. Peso Ranking / Apadrinhamento (Até 30 pontos)
      if (creative.rank === 'veterano') {
        score += 30;
      } else if (creative.rank === 'apadrinhado') {
        score += 10;
      }

      // 4. Peso Carga de Trabalho (Penalidade)
      // Reduz o score dependendo de quantos jobs ativos o criativo tem para distribuir melhor
      const activeJobs = creative._count?.jobsAsCreative || 0;
      score -= (activeJobs * 15);

      // 5. Afinidade por Categoria / Especialidade (Sem Limite, +10 pontos por job anterior na mesma categoria)
      const categoryExperience = creative.jobsAsCreative?.length || 0;
      score += (categoryExperience * 10);

      // 6. Interesse Atual no Radar (Forte peso determinante: +500 pontos se ele marcou que quer isso AGORA)
      const isInterestedNow = creative.activeCategories && (creative.activeCategories.includes(title) || creative.activeCategories.includes('Topa Tudo'));
      if (isInterestedNow) {
        score += 500;
      } else {
        // Se ele está online mas não marcou essa categoria nem Topa Tudo, toma penalidade massiva
        score -= 500; 
      }

      // 7. Fator Aleatório / Sorte (Até 5 pontos) para evitar empates constantes
      score += Math.random() * 5;
      
      return { ...creative, matchScore: score, activeJobs, categoryExperience };
    });

    // Ordena do maior score para o menor
    scoredCreatives.sort((a, b) => b.matchScore - a.matchScore);
    
    // Seleciona o vencedor
    const bestCreative = scoredCreatives[0];
    selectedCreativeId = bestCreative.id;
    matchmakingReason = `Alocado via Algoritmo Heurístico. Score: ${bestCreative.matchScore.toFixed(1)}/100 (SLA: ${bestCreative.ratingScore}, Nível: ${bestCreative.rank}, Jobs Ativos: ${bestCreative.activeJobs}, Afinidade Categoria: ${bestCreative.categoryExperience} jobs)`;

    // 6. Atualiza o Job com a alocação do Criativo PENDENTE de aceite
    const updatedJob = await prisma.job.update({
      where: { id: job.id },
      data: { 
        creativeId: selectedCreativeId,
        status: 'pending_accept',
        // Salvamos o motivo da IA na descrição pra fins de log (opcional)
        description: `${description}\n\n[Log da IA]: ${matchmakingReason}`
      },
      include: {
        creative: { 
          select: { 
            id: true,
            name: true, 
            rank: true, 
            ratingScore: true, 
            portfolioUrl: true 
          } 
        }
      }
    });

    return NextResponse.json({ success: true, match: updatedJob });

  } catch (error) {
    console.error('Erro no Algoritmo de Matchmaking:', error);
    return NextResponse.json({ error: 'Falha no roteamento do job' }, { status: 500 });
  }
}
