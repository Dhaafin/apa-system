import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionCookie = request.cookies.get("session");
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect root path
  if (pathname === "/") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from login/register pages
  if (pathname === "/login" || pathname === "/register") {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Config to target specific routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
