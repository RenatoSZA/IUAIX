import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const clientId = payload.sub as string;

    const body = await request.json();
    const { jobId } = body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 });
    if (job.clientId !== clientId && job.creativeId !== clientId) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });

    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'canceled' }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cancel Job Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
