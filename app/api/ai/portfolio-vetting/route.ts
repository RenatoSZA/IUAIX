import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import * as cheerio from 'cheerio'; // Instalar cheerio para extrair metadados

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'fallback',
});

export async function POST(request: Request) {
  try {
    // 1. Verificação de Segurança
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const { portfolioUrl } = await request.json();
    if (!portfolioUrl) return NextResponse.json({ error: 'URL do portfólio obrigatória' }, { status: 400 });

    // Puxa os dados do usuário para cruzar a identidade
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    let pageTitle = "Desconhecido";
    let pageDescription = "Desconhecida";
    let textContent = "";

    // 2. Web Scraping Leve (Extrair meta tags da URL para a IA analisar)
    try {
      const response = await fetch(portfolioUrl, { headers: { 'User-Agent': 'Iuaix-Forensics-Bot/1.0' } });
      const html = await response.text();
      const $ = cheerio.load(html);
      pageTitle = $('title').text() || $('meta[property="og:title"]').attr('content') || "Desconhecido";
      pageDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || "Desconhecida";
      textContent = $('body').text().substring(0, 1500).replace(/\s+/g, ' '); // Pega os primeiros 1500 caracteres
    } catch (e) {
      console.log('Aviso: Não foi possível fazer scraping completo da URL. IA usará apenas a estrutura da URL.');
    }

    if (!process.env.OPENAI_API_KEY) {
      // Simulação para quando não há chave OpenAI
      await new Promise(resolve => setTimeout(resolve, 3000));
      await prisma.user.update({
        where: { id: userId },
        data: { portfolioUrl, accountStatus: 'awaiting_sponsor' }
      });
      return NextResponse.json({ 
        success: true, 
        status: 'awaiting_sponsor',
        reason: 'Simulação: Portfólio aprovado e enviado para a fila de Veteranos.' 
      });
    }

    // 3. Análise Forense com GPT-4o (Antiplágio e Veracidade)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é a IA de Forense e Auditoria da Iuaix. Sua função é proteger a plataforma contra falsos profissionais, golpistas e plagiadores de portfólio.
Regras de Análise:
1. VALIDADE: A URL é realmente de um portfólio de design/criativo? (ex: Behance, Dribbble, site pessoal com tags de design). Se for link de Google Drive vazio, spam ou rede social trancada, REPROVE.
2. IDENTIDADE (ANTI-PLÁGIO): O nome do dono da conta (${user.name}) bate com os metadados da URL? Se o cara se chama 'Carlos' e manda o behance da 'Agência XYZ de Nova York', é plágio/roubo de identidade. REPROVE.
3. CONTEÚDO GENÉRICO: Se a descrição parecer um template comprado ou um gerador automático genérico sem conexão com design, FLARE DE SUSPEITA.
Responda ESTRITAMENTE no formato JSON:
{
  "approved": boolean,
  "confidenceScore": number (0 a 100),
  "reason": "Explicação detalhada da sua decisão."
}`
        },
        {
          role: "user",
          content: `DADOS DO USUÁRIO NA IUAIX:
Nome: ${user.name}
Email: ${user.email}

DADOS EXTRAÍDOS DA URL DO PORTFÓLIO (${portfolioUrl}):
Título da Página: ${pageTitle}
Descrição: ${pageDescription}
Trechos de Texto Encontrados: ${textContent}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || '{}');
    
    // 4. Decisão Final e Atualização do Banco
    const newStatus = aiResult.approved ? 'awaiting_sponsor' : 'rejected';

    await prisma.user.update({
      where: { id: userId },
      data: {
        portfolioUrl,
        accountStatus: newStatus
      }
    });

    return NextResponse.json({
      success: true,
      status: newStatus,
      confidence: aiResult.confidenceScore,
      reason: aiResult.reason
    });

  } catch (error) {
    console.error('Erro na auditoria do portfólio:', error);
    return NextResponse.json({ error: 'Erro interno no motor de Forense' }, { status: 500 });
  }
}
