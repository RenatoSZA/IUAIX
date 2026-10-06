import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, briefing, deadline, userId } = body;

    if (!title || !briefing || !deadline) {
      return NextResponse.json({ error: 'Dados insuficientes para precificação.' }, { status: 400 });
    }

    let vaultContext = '';
    if (userId) {
      const vault = await prisma.brandVault.findFirst({
        where: { clientId: userId },
        orderBy: { createdAt: 'desc' }
      });
      if (vault && vault.content) {
        vaultContext = `\n\n=== REGRAS DE BRAND VAULT DO CLIENTE ===\n${vault.content}\n====================================`;
      }
    }

    // NOVO ALGORITMO DE PRECIFICAÇÃO (Substitui Gemini)
    // Calcula o orçamento baseando-se em palavras-chave do título/briefing e no prazo.
    const combinedText = (title + " " + briefing).toLowerCase();
    
    let basePrice = 500; // Preço mínimo padrão
    let complexity = "Baixa";
    let reasoning = "Preço base de tabela.";

    // 1. Análise de Complexidade por Palavras-Chave
    if (combinedText.includes('3d') || combinedText.includes('animação') || combinedText.includes('motion') || combinedText.includes('sistema completo') || combinedText.includes('app')) {
      basePrice = 2500;
      complexity = "Alta";
      reasoning = "Serviços avançados (como 3D, animação ou apps completos) exigem maior carga horária e profissionais altamente especializados.";
    } else if (combinedText.includes('landing page') || combinedText.includes('identidade visual') || combinedText.includes('rebranding') || combinedText.includes('ui/ux') || combinedText.includes('site')) {
      basePrice = 1200;
      complexity = "Média";
      reasoning = "O desenvolvimento de identidades completas ou páginas web envolve pesquisa estrutural e design estratégico, ajustando-se à média de mercado.";
    } else if (combinedText.includes('logo') || combinedText.includes('post') || combinedText.includes('banner') || combinedText.includes('flyer')) {
      basePrice = 300;
      complexity = "Baixa";
      reasoning = "Peças gráficas unitárias ou pontuais possuem um fluxo de aprovação mais rápido e escopo fechado.";
    }

    // 2. Análise de Prazo (Rush Fee)
    const deadlineLower = deadline.toLowerCase();
    let rushFeeMultiplier = 1.0;
    let urgencyText = "";

    if (deadlineLower.includes('24h') || deadlineLower.includes('urgente') || deadlineLower.includes('hoje') || deadlineLower.includes('amanhã') || deadlineLower.includes('1 dia')) {
      rushFeeMultiplier = 1.5; // +50%
      urgencyText = " Foi adicionada uma taxa de urgência (50%) pelo prazo curtíssimo solicitado.";
    } else if (deadlineLower.includes('48h') || deadlineLower.includes('2 dias')) {
      rushFeeMultiplier = 1.3; // +30%
      urgencyText = " Inclui taxa de aceleração (30%) para garantir a entrega em 48h.";
    } else {
      urgencyText = " O prazo está dentro do fluxo normal, sem taxas de urgência.";
    }

    const estimatedPriceBRL = Math.round(basePrice * rushFeeMultiplier);
    
    // 3. Adiciona peso se houver Brand Vault (Complexidade de conformidade)
    if (vaultContext !== '') {
      reasoning += " A presença de um Brand Vault estrito requer tempo extra de conformidade por parte do profissional.";
    }

    reasoning += urgencyText;

    const pricingData = {
      estimatedPriceBRL,
      complexity,
      reasoning
    };

    return NextResponse.json(pricingData);
  } catch (error: any) {
    console.error('Erro na API de Precificação (Fallback Acionado):', error);
    
    // Fallback gracioso
    return NextResponse.json({
      estimatedPriceBRL: 800,
      complexity: "Média (Estimativa Base)",
      reasoning: "Utilizamos uma precificação base de mercado devido a um erro no algoritmo orçamentista."
    });
  }
}
