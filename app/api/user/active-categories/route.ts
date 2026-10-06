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
    const userId = payload.sub as string;

    const body = await request.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categorias inválidas' }, { status: 400 });
    }

    const activeCategoriesStr = categories.join(',');

    await prisma.user.update({
      where: { id: userId },
      data: { activeCategories: activeCategoriesStr }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar categorias ativas:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
