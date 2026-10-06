import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // A segurança real roda no servidor (Edge) antes de carregar o HTML
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('iuaix_token')?.value;

  // Rotas restritas que exigem login
  const protectedPaths = ['/dashboard', '/chat', '/cliente', '/matchmaking', '/vault', '/profissional', '/admin', '/checkout'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  let verifiedRole = null;

  if (token) {
    try {
      const JWT_SECRET = getJwtSecret();
      const { payload } = await jwtVerify(token, JWT_SECRET);
      verifiedRole = payload.role as string;
    } catch (err) {
      // Token inválido ou expirado
      verifiedRole = null;
    }
  }

  if (isProtected && !verifiedRole) {
    // Redireciona usuários deslogados antes do carregamento da tela
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Se já estiver logado, não precisa acessar login ou cadastro
  const authPaths = ['/login', '/cadastro'];
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  if (isAuthPath && verifiedRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Prevenção de Escalada de Privilégio (Role-Based Access Control - RBAC)
  if (verifiedRole === 'criativo' && (pathname.startsWith('/cliente') || pathname.startsWith('/matchmaking') || pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se a empresa tentar acessar a área de profissionais
  if (verifiedRole === 'empresa' && pathname.startsWith('/profissional')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Prevenção de Rota Admin
  if (pathname.startsWith('/admin') && verifiedRole !== 'admin') {
    // Esconde a rota dando um redirecionamento seguro para a base
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ignora arquivos estáticos e _next
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
