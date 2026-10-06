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
    const userId = payload.sub as string;

    const body = await request.json();
    const { textContext, vaultId } = body;

    if (!textContext) {
      return NextResponse.json({ error: 'Contexto ausente' }, { status: 400 });
    }

    // 2. EXTRAÇÃO HEURÍSTICA DE REGRAS (Substitui GPT-4o)
    // O algoritmo tenta extrair informações usando palavras-chave comuns e regex simples.
    const textLower = textContext.toLowerCase();
    
    let slogan = "Não identificado";
    let targetAudience = "Público Geral";
    let toneOfVoice = "Profissional Padrão";
    const rules = [];

    // Extração de Slogan
    if (textLower.includes('slogan:')) {
      slogan = textContext.split(/slogan:/i)[1].split('\n')[0].trim();
    } else if (textLower.includes('frase de efeito:')) {
      slogan = textContext.split(/frase de efeito:/i)[1].split('\n')[0].trim();
    }

    // Extração de Público-Alvo
    if (textLower.includes('público:')) {
      targetAudience = textContext.split(/público:/i)[1].split('\n')[0].trim();
    } else if (textLower.includes('target:')) {
      targetAudience = textContext.split(/target:/i)[1].split('\n')[0].trim();
    }

    // Extração de Tom de Voz
    if (textLower.includes('tom:')) {
      toneOfVoice = textContext.split(/tom:/i)[1].split('\n')[0].trim();
    }

    // Extração Dinâmica de DO's e DONT's
    const lines = textContext.split('\n');
    for (const line of lines) {
      const lineLower = line.toLowerCase();
      if (lineLower.includes('nunca') || lineLower.includes('não usar') || lineLower.includes('evitar') || lineLower.includes("don't")) {
        rules.push({ type: 'dont', text: line.replace(/^(?:[-*>]|nunca|não usar|evitar|don't)\s*/i, '').trim() });
      } else if (lineLower.includes('sempre') || lineLower.includes('deve ter') || lineLower.includes('priorizar') || lineLower.includes('usar') || lineLower.includes('do')) {
        rules.push({ type: 'do', text: line.replace(/^(?:[-*>]|sempre|deve ter|priorizar|usar|do)\s*/i, '').trim() });
      }
    }

    // Fallbacks para caso o texto seja muito solto
    if (rules.length === 0) {
      rules.push({ type: 'do', text: 'Manter legibilidade e contraste adequado.' });
      rules.push({ type: 'dont', text: 'Evitar poluição visual.' });
    }

    const brandRulesJson = JSON.stringify({
      slogan,
      targetAudience,
      toneOfVoice,
      rules: rules.slice(0, 10) // Limita a 10 regras
    });

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
