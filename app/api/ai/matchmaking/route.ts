import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    // 1. Verificação de Autenticação Segura
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
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



    // 4. Puxa todos os Criativos disponíveis COM o contexto de performance e patentes
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
        reviewsCount: true 
      }
    });

    if (availableCreatives.length === 0) {
      return NextResponse.json({ error: 'Nenhum criativo disponível na rede no momento.' }, { status: 404 });
    }

    let selectedCreativeId = availableCreatives[0].id; // Fallback
    let matchmakingReason = "Alocação automática via SLA.";

    try {
      if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-mock-key-for-build') {
        console.log('Sem chave OpenAI. Usando Fallback Local...');
        const bestCreative = availableCreatives.sort((a, b) => b.ratingScore - a.ratingScore)[0];
        selectedCreativeId = bestCreative.id;
        matchmakingReason = "Alocação manual (Chave Ausente)";
      } else {
        const prompt = `Você é o sistema de roteamento do Iuaix DaaS.
          Vibe da Marca do Cliente: ${brandVibe}
          
          Job Solicitado: ${title}
          Desc: ${description}
          
          Criativos Disponíveis na fila:
          ${JSON.stringify(availableCreatives, null, 2)}
          
          Regras:
          - Escolha o ID do criativo que melhor atende à demanda.
          - Se for crítico, priorize veteranos ou quem tem maior SLA.
          - Retorne EXATAMENTE um JSON válido com a estrutura:
          { "selectedId": "id_aqui", "reason": "motivo resumido" }`;

        const model = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: "application/json" }
        });
        
        const completion = await model.generateContent(prompt);
        const text = completion.response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(cleanText || '{}');
        if (result.selectedId) {
          selectedCreativeId = result.selectedId;
          matchmakingReason = result.reason || matchmakingReason;
        }
      }
    } catch (aiError: any) {
      console.warn("⚠️ IA falhou (Sem Saldo/Indisponível). Usando Fallback de SLA.", aiError.message);
      const sortedCreatives = [...availableCreatives].sort((a, b) => b.ratingScore - a.ratingScore);
      selectedCreativeId = sortedCreatives[0].id;
      matchmakingReason = "Alocação via SLA Máximo (Fallback IA indisponível).";
    }

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
