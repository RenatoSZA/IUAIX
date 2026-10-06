import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, portfolioUrl: true, role: true, profilePic: true }
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao carregar perfil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.sub as string;

    const { name, portfolioUrl, profilePic } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, portfolioUrl, profilePic }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }
}
