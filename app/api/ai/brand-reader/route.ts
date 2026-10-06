import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

// Inicializa a OpenAI (Fallback pra evitar crash se a chave não existir no .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key-for-build',
});

export async function POST(request: Request) {
  try {
    // 1. Verificação de Autenticação Segura
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const body = await request.json();
    const { textContext, vaultId } = body;

    if (!textContext) {
      return NextResponse.json({ error: 'Contexto ausente' }, { status: 400 });
    }

    let brandRulesJson;

    // Se não tivermos chave real configurada, retornamos um mock simulando a IA
    if (!process.env.OPENAI_API_KEY) {
      console.log('Simulando IA do Brand Vault (Modo Local)...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Tempo da IA pensar
      brandRulesJson = JSON.stringify({
        slogan: "Slogan Extraído pela IA",
        targetAudience: "Público detectado baseado no contexto...",
        toneOfVoice: "Tom de voz profissional e direto.",
        rules: [
          { type: 'do', text: 'Usar fontes sem serifa' },
          { type: 'dont', text: 'Não usar emojis em excesso' }
        ]
      });
    } else {
      // 2. Chamada Real para a Inteligência Artificial
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um Diretor de Arte Sênior. Analise o contexto da marca fornecido pelo usuário e retorne um JSON extrato com as seguintes chaves: 'slogan', 'targetAudience', 'toneOfVoice' e 'rules' (um array de objetos com 'type': 'do' ou 'dont' e 'text'). Apenas o JSON válido."
          },
          {
            role: "user",
            content: `Analise as referências desta marca: ${textContext}`
          }
        ],
        response_format: { type: "json_object" }
      });

      brandRulesJson = completion.choices[0].message.content;
    }

    // 3. Atualiza o Brand Vault no Banco de Dados
    if (vaultId) {
      await prisma.brandVault.update({
        where: { id: vaultId },
        data: { content: brandRulesJson }
      });
    }

    return NextResponse.json({ success: true, extraction: JSON.parse(brandRulesJson || '{}') });

  } catch (error) {
    console.error('Erro na IA do Brand Vault:', error);
    return NextResponse.json({ error: 'Falha no processamento cognitivo' }, { status: 500 });
  }
}
