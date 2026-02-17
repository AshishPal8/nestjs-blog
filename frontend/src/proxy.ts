import { NextRequest, NextResponse } from "next/server";
import { getRouteType } from "./lib/getRouteAccess";
import { verifyToken } from "./lib";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const routeType = getRouteType(pathname);
  const token = request.cookies.get("auth_token")?.value;

  if (routeType === "public") {
    return NextResponse.next();
  }

  if (routeType === "guest") {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
    return NextResponse.next();
  }

  if (routeType === "protected" || routeType === "admin") {
    if (!token) {
      const url = new URL("/", request.url);
      url.searchParams.set("login", "required");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyToken(token);

    if (!payload) {
      const url = new URL("/", request.url);
      url.searchParams.set("login", "required");
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    if (routeType === "admin") {
      const userRole = payload.role as string;
      if (userRole !== "admin") {
        const url = new URL("/", request.url);
        url.searchParams.set("error", "unauthorized");
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
