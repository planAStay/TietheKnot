import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'tietheknot-testing-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for authentication cookie
  const authCookie = request.cookies.get(COOKIE_NAME)
  const isAuthenticated = authCookie?.value === 'authenticated'

  // Always allow static assets and Next.js internal routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/password') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|woff|woff2|ttf|eot|json)$/)
  ) {
    return NextResponse.next()
  }

  // Public routes - accessible without password protection
  // /get-started: public landing page
  // /password: password entry for team testing
  // Auth routes: user authentication (team members can login after password)
  const publicRoutes = [
    '/get-started',
    '/password',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Allow other API routes (they're separate from the frontend routes)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // If authenticated, allow access to all routes
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // For all other routes, redirect to /get-started (including root /)
  // This means public users always see the coming soon page
  return NextResponse.redirect(new URL('/get-started', request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/password (handled explicitly in middleware)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!api/auth/password|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
