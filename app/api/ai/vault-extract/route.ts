import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

async function scrapeUrl(url: string) {
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) return '';
    const html = await response.text();
    const $ = cheerio.load(html);
    $('script, style').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.substring(0, 15000); 
  } catch (error) {
    console.error(`Erro ao fazer scrape da URL ${url}:`, error);
    return '';
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attachments } = body; 

    if (!attachments || attachments.length === 0) {
      return NextResponse.json({ error: 'Nenhuma URL fornecida.' }, { status: 400 });
    }

    let combinedContext = '';
    for (const url of attachments) {
      if (url.startsWith('http')) {
        const text = await scrapeUrl(url);
        combinedContext += `Conteúdo da URL (${url}):\n${text}\n\n`;
      }
    }

    if (!combinedContext.trim()) {
      combinedContext = "Nenhum conteúdo de texto pôde ser extraído das URLs fornecidas. Tente deduzir pelo próprio formato da URL ou crie regras genéricas de alto padrão baseadas no nicho.";
    }

    // ALGORITMO HEURÍSTICO DE EXTRAÇÃO DE MARCA (Substitui Gemini)
    const textLower = combinedContext.toLowerCase();
    
    // Tenta encontrar um nome no texto (Ex: pegando o primeiro H1 ou título que possa ter vindo na primeira linha)
    let brandName = "Marca Extraída (Heurística)";
    const firstLines = combinedContext.split('\n').filter(l => l.trim().length > 0);
    if (firstLines.length > 0 && firstLines[0].length < 50) {
      brandName = firstLines[0];
    }

    const brandData = {
      name: brandName,
      slogan: textLower.includes('inovação') ? 'Foco em Inovação' : 'Soluções Corporativas',
      targetAudience: "Público detectado via scraping local",
      toneOfVoice: textLower.includes('tecnologia') ? "Moderno e Tech" : "Profissional Padrão",
      colors: ["#111111", "#F5F5F5", "#0F3CC9"], // Cores padrão injetadas
      fonts: ["Inter", "Roboto"],
      vibe: ["Limpo", "Direto", "Corporativo"],
      rules: [
        { type: "do", text: "Manter padrão de contraste WCAG" },
        { type: "do", text: "Usar espaços em branco adequados (breathing room)" },
        { type: "dont", text: "Evitar gradientes muito intensos ou poluição visual" },
        { type: "dont", text: "Não usar fotos de banco de imagens muito genéricas" }
      ]
    };

    // Extração básica de cores HEX se existirem no texto
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g;
    const foundColors = combinedContext.match(hexRegex);
    if (foundColors && foundColors.length > 0) {
      brandData.colors = Array.from(new Set(foundColors)).slice(0, 4);
    }

    return NextResponse.json(brandData);
  } catch (error: any) {
    console.error('Erro na extração do Brand Vault:', error);
    
    return NextResponse.json({
      name: "Fallback Local",
      slogan: "Sistema de extração offline",
      targetAudience: "Geral",
      toneOfVoice: "Profissional",
      colors: ["#0f172a", "#0F3CC9", "#FDE047"],
      fonts: ["Inter", "Helvetica"],
      vibe: ["Moderno", "Limpo"],
      rules: [
        { type: "do", text: "Use alto contraste visual." },
        { type: "dont", text: "Não use imagens distorcidas." }
      ]
    });
  }
}
