import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    const systemPrompt = `Você é a IA Curadora da IUAIX (Brand Guardian).
Seu objetivo é analisar o conteúdo extraído dos sites/arquivos do cliente e extrair as diretrizes da marca (Brand Vault).
Você DEVE responder EXATAMENTE no formato JSON abaixo. Preencha todos os campos da melhor forma possível usando as informações lidas.
Se a empresa for tech, dedeza regras modernas. Use as cores descritas ou deduzidas do texto. Responda APENAS O JSON (sem markdown).
{
  "name": "Nome da Marca",
  "slogan": "Slogan ou Proposta de Valor",
  "targetAudience": "Descrição do público alvo",
  "toneOfVoice": "Tom de voz da marca",
  "colors": ["#000000", "#FFFFFF", "#FF0000"],
  "fonts": ["Nome da Fonte", "Outra Fonte"],
  "vibe": ["Tag1", "Tag2", "Tag3"],
  "rules": [
    { "type": "do", "text": "Regra do que fazer" },
    { "type": "dont", "text": "Regra do que não fazer" }
  ]
}`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const userPrompt = `Arquivos fornecidos:\n${attachments.join(', ')}\n\nConteúdo extraído das páginas web:\n${combinedContext}`;
    
    const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const brandData = JSON.parse(cleanText);

    return NextResponse.json(brandData);
  } catch (error: any) {
    console.error('Erro na extração do Brand Vault (Possível Cota Excedida / Sem Chave):', error);
    
    return NextResponse.json({
      name: "Sua Marca (Fallback Gemini)",
      slogan: "Cota da IA excedida ou chave faltando, carregando template base.",
      targetAudience: "Público alvo detectado via heurística padrão.",
      toneOfVoice: "Profissional, direto e inovador.",
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
