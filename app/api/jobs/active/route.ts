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
    const userId = payload.sub as string;
    const role = payload.role as string;

    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          { clientId: userId },
          { creativeId: userId }
        ],
        status: { in: ['pending_accept', 'active', 'reviewing'] }
      },
      include: {
        client: { select: { name: true } },
        creative: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Fetch active jobs error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
