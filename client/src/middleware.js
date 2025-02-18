import { NextResponse } from "next/server"

export function middleware(request) {
  const authToken = request.cookies.get("authToken")?.value
  const path = request.nextUrl.pathname

  // If user is not authenticated and trying to access dashboard
  if (!authToken && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is authenticated and trying to access login or signup
  if (authToken && (path === "/login" || path === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard/" + authToken, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
}

