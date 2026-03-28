import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl

  // List of public paths that don't require authentication
  const publicPaths = [
    '/login',
    '/membership-request',
    // '/forgot-password',
    '/reset-password',
    '/trainer-signup',
    '/receipts',
    '/workout-pdfs'
  ]

  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  const isRoot = pathname === '/'

  // Redirect authenticated users away from public auth pages
  if (token && (isPublicPath || isRoot)) {
    // If user tries to go to login or root while authenticated, send them to dashboard
    if (pathname === '/login' || isRoot) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect unauthenticated users to login page
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc - harder to strictly regex, but usually in public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
