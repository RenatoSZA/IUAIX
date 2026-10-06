import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    const systemPrompt = `Você é um precificador algorítmico da IUAIX, uma plataforma de DaaS (Design as a Service).
Seu objetivo é ler o pedido de um cliente e calcular um orçamento justo de mercado em Reais (BRL).
Considere o grau de dificuldade/complexidade do pedido e o prazo de entrega.
Prazos muito curtos (24h-48h) devem obrigatoriamente incluir uma taxa de urgência (rush fee) que eleva o preço em 30 a 50%.
Jobs extremamente complexos ou que exigem múltiplos formatos cobram acima da média.
Responda EXATAMENTE com um objeto JSON neste formato puro (sem crases de formatação markdown):
{
  "estimatedPriceBRL": 1500,
  "complexity": "Alta",
  "reasoning": "Sua justificativa clara e direta para o cliente sobre como você chegou a esse valor, mencionando o impacto do prazo e os padrões atuais de mercado."
}`;

    const userPrompt = `Categoria do Job: ${title}\nPrazo de Entrega Solicitado: ${deadline}\n\nBriefing do Cliente:\n${briefing}${vaultContext}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const text = result.response.text();
    
    // Limpa possíveis blocos markdown caso o modelo ignore o mimetype
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const pricingData = JSON.parse(cleanText);

    return NextResponse.json(pricingData);
  } catch (error: any) {
    console.error('Erro na API de Precificação (Fallback Acionado):', error);
    
    // Fallback gracioso caso a API falhe ou falte a key
    return NextResponse.json({
      estimatedPriceBRL: 800,
      complexity: "Média (Estimativa Base)",
      reasoning: "Utilizamos uma precificação base de mercado devido a uma instabilidade temporária na chave do motor de IA."
    });
  }
}
