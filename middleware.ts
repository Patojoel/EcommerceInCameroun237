import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect admin routes - require ADMIN role
    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Protect account routes - require authentication
    if (pathname.startsWith("/account")) {
      if (!token) {
        return NextResponse.redirect(
          new URL(`/login?callbackUrl=${pathname}`, req.url)
        );
      }
    }

    // Protect checkout - require authentication
    if (pathname === "/checkout") {
      if (!token) {
        return NextResponse.redirect(
          new URL("/login?callbackUrl=/checkout", req.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Always allow access to public routes, let middleware handle protection
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/account") ||
          pathname === "/checkout"
        ) {
          return true; // Let the middleware function handle it
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout"],
};
