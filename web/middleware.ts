import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { env } from './lib/env'

// Rotas que não precisam de autenticação
const publicRoutes = [
  '/auth/sign-in',
  '/api/auth',
  '/_next',
  '/favicon.ico',
]

// Rotas de API que não precisam de autenticação
const publicApiRoutes = [
  '/api/auth/github',
  '/api/auth/github/callback',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir rotas públicas
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Permitir rotas de API públicas
  if (publicApiRoutes.some(route => pathname === route)) {
    return NextResponse.next()
  }

  // Verificar token de autenticação
  const authToken = request.cookies.get('auth_token')

  if (!authToken?.value) {
    // Redirecionar para página de login se não houver token
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Verificar se o token é válido
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET)

    if (!secret) {
      console.error('JWT_SECRET não encontrado')
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    const { payload } = await jwtVerify(authToken.value, secret)

    // Verificar se o token contém um ID de usuário válido
    if (!payload.sub || typeof payload.sub !== 'string') {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    // Token válido, continuar com a requisição
    return NextResponse.next()
  } catch (error) {
    console.error('Erro ao verificar token JWT:', error)
    // Token inválido ou expirado, redirecionar para login
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
