import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and public routes
const protectedRoutes = [
  '/dashboard',
  '/dashboard-new',
  '/create-story',
  '/admin',
]

const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/auth/callback',
  '/api/auth/google',
  '/api/auth/apple',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/webhooks',
  '/api/health',
]

// Helper function to check if a path matches any pattern
function matchesPattern(pathname: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('(.*)')) {
      const basePattern = pattern.replace('(.*)', '')
      return pathname.startsWith(basePattern)
    }
    return pathname === pattern || pathname.startsWith(pattern + '/')
  })
}

// Helper function to get token from request
function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Check cookies
  const tokenCookie = request.cookies.get('auth_token')
  if (tokenCookie) {
    return tokenCookie.value
  }

  return null
}

// Helper function to verify JWT token
async function verifyToken(token: string): Promise<boolean> {
  try {
    // Make a request to your backend to verify the token
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${apiBaseUrl}/api/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.authenticated === true
    }
  } catch (error) {
    console.error('Token verification failed:', error)
  }

  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all public routes
  if (matchesPattern(pathname, publicRoutes)) {
    return NextResponse.next()
  }

  // Check if this is a protected route
  if (matchesPattern(pathname, protectedRoutes)) {
    const token = getTokenFromRequest(request)

    if (!token) {
      // No token found, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Verify the token with your backend
    const isValidToken = await verifyToken(token)
    
    if (!isValidToken) {
      // Invalid token, redirect to sign-in
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect', pathname)
      signInUrl.searchParams.set('error', 'session_expired')
      return NextResponse.redirect(signInUrl)
    }

    // Token is valid, allow access
    return NextResponse.next()
  }

  // For all other routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
