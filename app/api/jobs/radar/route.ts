import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const creativeId = payload.sub as string;
    const role = payload.role as string;

    if (role !== 'criativo') {
      return NextResponse.json({ error: 'Apenas criativos têm acesso ao radar' }, { status: 403 });
    }

    // Busca o primeiro job direcionado a ele que esteja pendente
    const job = await prisma.job.findFirst({
      where: { 
        creativeId: creativeId,
        status: 'pending_accept'
      },
      orderBy: { createdAt: 'asc' },
      include: {
        client: { select: { name: true } }
      }
    });

    if (!job) {
      return NextResponse.json({ job: null });
    }

    return NextResponse.json({ job });

  } catch (error) {
    console.error('Erro no Radar:', error);
    return NextResponse.json({ error: 'Erro interno no radar' }, { status: 500 });
  }
}
