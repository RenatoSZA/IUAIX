import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const creativeId = payload.sub as string;

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json({ error: 'ID do Job não fornecido' }, { status: 400 });
    }

    // Verifica se o job pertence a ele e está pendente
    const job = await prisma.job.findFirst({
      where: { 
        id: jobId,
        creativeId: creativeId,
        status: 'pending_accept'
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job indisponível ou já expirado.' }, { status: 400 });
    }

    // Atualiza para 'active'
    const updatedJob = await prisma.job.update({
      where: { id: job.id },
      data: { status: 'active' }
    });

    return NextResponse.json({ success: true, job: updatedJob });

  } catch (error) {
    console.error('Erro ao aceitar Job:', error);
    return NextResponse.json({ error: 'Erro interno ao processar aceite' }, { status: 500 });
  }
}
