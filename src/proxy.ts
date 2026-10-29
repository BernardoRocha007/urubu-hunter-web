import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TOKEN_STORAGE_KEY = 'urubu_auth_token';

/**
 * Middleware para proteção de rotas no Next.js App Router.
 * - Garante que a rota raiz ('/') e rotas do app exijam login.
 * - Redireciona usuários não autenticados diretamente para '/login'.
 * - Redireciona usuários já autenticados de '/login' para a rota principal '/'.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_STORAGE_KEY)?.value;
  const { pathname } = request.nextUrl;

  // Se já estiver logado e tentar acessar /login, manda para a home
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Se NÃO estiver logado e tentar acessar a rota base ou qualquer rota protegida
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica nas rotas do app, excluindo:
     * - api (rotas de backend se houver)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, ícones e imagens públicas
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif)).*)'
  ]
};
