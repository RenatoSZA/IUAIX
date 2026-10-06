import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { jwtVerify } from 'jose';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rate-limit';

// Permite no máximo 10 uploads por IP a cada 10 minutos (Evita Storage Exhaustion)
const uploadLimiter = rateLimit({
  interval: 10 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export const maxDuration = 30; // Evita que requests pesados travem as conexões do banco de dados (Timeout)

export async function POST(request: Request) {
  try {
    // 0. Escudo Anti-Spam de Arquivos
    const ip = headers().get('x-forwarded-for') || '127.0.0.1';
    try {
      await uploadLimiter.check(10, ip);
    } catch {
      return NextResponse.json({ error: 'Limite de upload excedido. Tente novamente mais tarde.' }, { status: 429 });
    }

    // 1. Verificação de Segurança (Apenas logados sobem arquivos)
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    // 2. Extração do Arquivo do Formulário (Multipart FormData)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // [MITIGAÇÃO DE SEGURANÇA]: Bloqueio de Arquivos Gigantes (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Arquivo muito grande. Limite de 5MB.' }, { status: 413 });
    }

    // [MITIGAÇÃO DE SEGURANÇA]: Bloqueio de Scripts Maliciosos (MIME Type Sniffing)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato de arquivo não permitido (Risco de Segurança).' }, { status: 415 });
    }

    // 3. Preparação do Buffer e Nome Único
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // [MITIGAÇÃO DE SEGURANÇA]: Prevenção contra Directory Traversal (LFI)
    // Removemos todas as barras e pontos duplos para impedir ataques do tipo "../../../"
    const safeName = file.name
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Tira acentos
      .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Substitui caracteres estranhos
      .replace(/\.+/g, '.'); // Evita múltiplos pontos
      
    const fileName = `${userId}/${uuidv4()}_${safeName}`;

    // 4. Upload para o Supabase (Bucket: 'vault')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vault')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Erro no Supabase:', uploadError);
      return NextResponse.json({ error: 'Falha ao enviar para o Supabase.' }, { status: 500 });
    }

    // 5. Pegar a URL pública do arquivo (se o bucket for público) ou gerar signed URL
    const { data: publicUrlData } = supabase.storage.from('vault').getPublicUrl(fileName);
    const assetUrl = publicUrlData.publicUrl;

    // 6. Registrar o arquivo no Banco de Dados Real
    const brandAsset = await prisma.brandVault.create({
      data: {
        clientId: userId,
        assetUrl: assetUrl,
        assetType: file.type.includes('pdf') ? 'pdf' : 'image'
      }
    });

    return NextResponse.json({ success: true, url: assetUrl, asset: brandAsset });

  } catch (error) {
    console.error('Erro de Upload:', error);
    return NextResponse.json({ error: 'Erro interno no processamento do arquivo' }, { status: 500 });
  }
}
