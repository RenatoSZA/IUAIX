import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Pegar histórico de mensagens de um Job
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) return NextResponse.json({ error: 'Job ID obrigatório' }, { status: 400 });

    const messages = await prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        client: { select: { id: true, name: true, role: true } },
        creative: { select: { id: true, name: true, role: true } }
      }
    });

    return NextResponse.json({ messages, job });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar mensagens' }, { status: 500 });
  }
}

// Enviar nova mensagem
export async function POST(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const body = await request.json();
    const { jobId, content, mediaUrl, mediaType } = body;

    if (!jobId || !content) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });

    const message = await prisma.message.create({
      data: {
        jobId,
        senderId: userId,
        content,
        mediaUrl,
        mediaType
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}
