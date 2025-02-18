import { NextResponse } from "next/server"

export function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/signup" || path === "/"

  const userId = request.cookies.get("userId")?.value

  // If the user is already on the dashboard, don't redirect
  if (path.startsWith("/dashboard/") && userId) {
    return NextResponse.next()
  }

  if (isPublicPath && userId) {
    // If the user is on a public path and has a userId cookie, redirect to dashboard
    return NextResponse.redirect(new URL(`/dashboard/${userId}`, request.url))
  }

  if (!isPublicPath && !userId) {
    // If the user is on a protected path and doesn't have a userId cookie, redirect to login
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // For all other cases, continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*"],
}

