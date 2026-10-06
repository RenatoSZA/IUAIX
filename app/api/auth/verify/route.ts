import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token inválido ou ausente.' }, { status: 400 });
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
    
    // Decodifica o token de verificação
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const email = payload.email as string;

    if (!email) throw new Error("E-mail não encontrado no token");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    if (user.emailVerified) {
      // Já está verificado, gera token e redireciona
      return await redirectWithLoginCookie(user.id, user.role, request);
    }

    // Marca o e-mail como verificado
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    // Loga o usuário e redireciona
    return await redirectWithLoginCookie(user.id, user.role, request);

  } catch (error) {
    console.error('Verify Error:', error);
    // Redireciona para login com erro
    const url = new URL('/login?error=TokenExpirado', request.url);
    return NextResponse.redirect(url);
  }
}

async function redirectWithLoginCookie(userId: string, role: string, request: Request) {
  const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');
  
  const token = await new SignJWT({ sub: userId, role: role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  const url = new URL('/dashboard', request.url);
  const response = NextResponse.redirect(url);
  
  response.cookies.set('iuaix_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24
  });

  response.cookies.set('iuaix_role', role, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24
  });

  return response;
}
