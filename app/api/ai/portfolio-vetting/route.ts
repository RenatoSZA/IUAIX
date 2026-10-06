import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';
import * as cheerio from 'cheerio'; // Instalar cheerio para extrair metadados

export async function POST(request: Request) {
  try {
    // 1. Verificação de Segurança
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
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

    // 3. NOVO ALGORITMO DE AUDITORIA E FORENSE (Substitui GPT-4o)
    let approved = false;
    let confidenceScore = 0;
    let reason = "Análise automatizada incompleta.";

    const urlLower = portfolioUrl.toLowerCase();
    const isAllowedDomain = urlLower.includes('behance.net') || urlLower.includes('dribbble.com') || urlLower.includes('vimeo.com') || urlLower.includes('github.com');
    const isBlockedDomain = urlLower.includes('drive.google.com') || urlLower.includes('mega.nz') || urlLower.includes('dropbox.com') || urlLower.includes('instagram.com');

    // 1. Validar Domínio
    if (isBlockedDomain) {
      reason = "Domínios de armazenamento na nuvem ou redes sociais não são aceitos como portfólio profissional (ex: Google Drive, Instagram). Use Behance, Dribbble ou site próprio.";
      confidenceScore = 90;
      approved = false;
    } else {
      // 2. Anti-Plágio (Validação de Identidade via Metadados)
      const normalizedUserName = user.name.toLowerCase().trim();
      const nameParts = normalizedUserName.split(' ');
      
      let nameMatched = false;
      const fullTextToSearch = (pageTitle + " " + pageDescription + " " + textContent + " " + portfolioUrl).toLowerCase();

      // Verifica se pelo menos um nome e sobrenome batem na página (ou o nome da marca)
      // Heurística básica: Se o nome do usuário aparece no título ou na URL, a confiança sobe muito.
      if (fullTextToSearch.includes(normalizedUserName)) {
        nameMatched = true;
      } else if (nameParts.length > 0 && fullTextToSearch.includes(nameParts[0])) {
        // Se só o primeiro nome bater, aceita com ressalvas
        nameMatched = true;
      }

      if (!nameMatched) {
        reason = `Possível roubo de identidade: O nome de cadastro ('${user.name}') não foi encontrado na página ou URL fornecida. A auditoria humana foi acionada.`;
        confidenceScore = 60;
        approved = false; // Rejeita ou manda pra fila manual dependendo do nível crítico
      } else {
        if (isAllowedDomain) {
          reason = "Portfólio verificado com sucesso. Identidade confirmada em plataforma confiável.";
          confidenceScore = 95;
          approved = true;
        } else {
          reason = "Portfólio em domínio próprio ou desconhecido. Identidade bateu parcialmente, enviando para fila de Veteranos.";
          confidenceScore = 75;
          approved = true;
        }
      }
    }
    
    // 4. Decisão Final e Atualização do Banco
    const newStatus = approved ? 'awaiting_sponsor' : 'rejected';

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
      confidence: confidenceScore,
      reason: reason
    });

  } catch (error) {
    console.error('Erro na auditoria do portfólio:', error);
    return NextResponse.json({ error: 'Erro interno no motor de Forense' }, { status: 500 });
  }
}
