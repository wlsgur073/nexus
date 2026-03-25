import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths: skip auth check
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Mock auth: admin routes require SYSTEM_ADMIN or STD_MANAGER role
  // TODO: Replace with real auth token check when backend is ready
  if (pathname.startsWith("/admin")) {
    const mockRole = request.cookies.get("codex-role")?.value;
    if (
      !mockRole ||
      (mockRole !== "SYSTEM_ADMIN" && mockRole !== "STD_MANAGER")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
