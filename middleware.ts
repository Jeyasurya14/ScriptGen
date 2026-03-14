import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/generate", "/referral", "/tokens"];
  
  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const url = new URL("/", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/generate/:path*",
    "/referral/:path*",
    "/tokens/:path*",
  ],
};
