import { NextResponse } from 'next/server'

export function middleware(request) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value
  const isLoggedIn = !!token
  
  const pathname = request.nextUrl.pathname
  
  // If user is logged in and trying to access login page (/), redirect to dashboard
  if (isLoggedIn && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // If user is NOT logged in and trying to access any protected route, redirect to /
  if (!isLoggedIn && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Allow the request to proceed
  return NextResponse.next()
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match ALL routes - this ensures middleware runs on every page
     * Excludes only static files and API routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.css$|.*\\.js$).*)',
  ],
}