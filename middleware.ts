import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // A segurança real roda no servidor (Edge) antes de carregar o HTML
  const role = request.cookies.get('iuaix_role')?.value;
  const { pathname } = request.nextUrl;

  // Rotas restritas que exigem login
  const protectedPaths = ['/dashboard', '/chat', '/cliente', '/matchmaking', '/vault', '/profissional', '/admin'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !role) {
    // Redireciona usuários deslogados antes do carregamento da tela
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Se já estiver logado, não precisa acessar login ou cadastro
  const authPaths = ['/login', '/cadastro'];
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  
  if (isAuthPath && role) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Prevenção de Escalada de Privilégio (Role-Based Access Control - RBAC)
  if (role === 'criativo' && (pathname.startsWith('/cliente') || pathname.startsWith('/matchmaking'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (role === 'empresa' && pathname.startsWith('/profissional')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Prevenção de Rota Admin
  if (pathname.startsWith('/admin') && role !== 'admin') {
    // Esconde a rota dando um redirecionamento seguro para a base
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ignora arquivos estáticos e _next
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
