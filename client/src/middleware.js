// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/signup' || path === '/'

  const userId = request.cookies.get('userId')?.value

  if (isPublicPath && userId) {
    // If the user is on a public path and has a userId cookie, redirect to dashboard
    return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url))
  }

  if (!isPublicPath && !userId) {
    // If the user is on a protected path and doesn't have a userId cookie, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/', '/login', '/signup', '/dashboard/:path*']
}