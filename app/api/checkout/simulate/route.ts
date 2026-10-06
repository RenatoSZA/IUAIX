import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verifica a identidade
    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const body = await request.json();
    const { plan, tokens, amount } = body;

    // Atualiza Tokens no Banco de Dados
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        tokens: { increment: tokens }
      }
    });

    // Registra a Transação de Simulação
    await prisma.transaction.create({
      data: {
        userId: userId,
        plan: plan || 'Simulação MVP',
        tokens: tokens,
        amount: amount || 0,
        status: 'simulated'
      }
    });

    return NextResponse.json({ success: true, tokens: user.tokens });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha na simulação de checkout' }, { status: 500 });
  }
}
