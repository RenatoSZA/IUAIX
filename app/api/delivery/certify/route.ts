import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import crypto from 'crypto';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // 1. Auth check
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    // 2. Extract Data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'Arquivo e Job ID obrigatórios.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Generate SHA-256 Hash (A Prova Criptográfica)
    const hashSum = crypto.createHash('sha256');
    hashSum.update(buffer);
    const fileHash = hashSum.digest('hex');

    // 4. Fetch Job & Users from DB
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { client: true, creative: true }
    });

    if (!job || job.creativeId !== userId) {
      return NextResponse.json({ error: 'Job não encontrado ou você não é o dono desta entrega.' }, { status: 403 });
    }

    // 5. Generate IP Transfer Certificate (PDF)
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('CERTIFICADO DE TRANSFERENCIA DE PROPRIEDADE INTELECTUAL', { x: 50, y: 730, size: 14, font, color: rgb(0, 0, 0) });
    page.drawText('PLATAFORMA IUAIX DAAS', { x: 50, y: 710, size: 12, font: regularFont, color: rgb(0.5, 0.5, 0.5) });

    page.drawText(`Contrato de Transacao: ${job.id}`, { x: 50, y: 660, size: 10, font: regularFont });
    page.drawText(`Data de Certificacao: ${new Date().toISOString()}`, { x: 50, y: 640, size: 10, font: regularFont });

    page.drawText('CEDENTE (Criador):', { x: 50, y: 600, size: 10, font });
    page.drawText(`Nome: ${job.creative?.name}`, { x: 50, y: 585, size: 10, font: regularFont });

    page.drawText('CESSIONARIO (Cliente/Dono):', { x: 50, y: 545, size: 10, font });
    page.drawText(`Nome/Empresa: ${job.client.name}`, { x: 50, y: 530, size: 10, font: regularFont });

    page.drawText('ASSINATURA CRIPTOGRAFICA DO ARQUIVO (SHA-256):', { x: 50, y: 490, size: 10, font });
    page.drawText(fileHash, { x: 50, y: 475, size: 9, font: regularFont, color: rgb(0, 0.2, 0.8) });

    const disclaimer = "Pelo presente certificado gerado pelos logs auditaveis da plataforma Iuaix, o Cedente transfere\n" +
                       "em carater definitivo e irrevogavel todos os direitos patrimoniais do arquivo digital correspondente\n" +
                       "ao Hash acima para o Cessionario, mediante liquidacao financeira via Stripe Escrow.";
    
    page.drawText(disclaimer, { x: 50, y: 420, size: 10, font: regularFont, lineHeight: 15 });

    const pdfBytes = await pdfDoc.save();

    // 6. Upload Final Asset & PDF to Supabase
    const safeName = file.name.normalize("NFD").replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const assetPath = `deliveries/${jobId}/${uuidv4()}_${safeName}`;
    const certPath = `certificates/${jobId}/cert_${fileHash.substring(0, 8)}.pdf`;

    // Upload Asset
    await supabase.storage.from('vault').upload(assetPath, buffer, { contentType: file.type });
    const { data: assetData } = supabase.storage.from('vault').getPublicUrl(assetPath);

    // Upload PDF Certificate
    await supabase.storage.from('vault').upload(certPath, Buffer.from(pdfBytes), { contentType: 'application/pdf' });
    const { data: certData } = supabase.storage.from('vault').getPublicUrl(certPath);

    // 7. Update Job in Prisma
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'reviewing',
        deliveryHash: fileHash,
        finalAssetUrl: assetData.publicUrl,
        certificateUrl: certData.publicUrl
      }
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error) {
    console.error('Erro ao gerar certificado:', error);
    return NextResponse.json({ error: 'Erro interno na geração do IP' }, { status: 500 });
  }
}
