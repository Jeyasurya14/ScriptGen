import nextAuthMiddleware from "next-auth/middleware";

export default nextAuthMiddleware;

export const config = {
  matcher: ["/app/:path*", "/dashboard/:path*", "/generate/:path*", "/referral/:path*", "/tokens/:path*"],
};
