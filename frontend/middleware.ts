import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // This is the only code that will run.
  // It will print a message to your terminal and immediately redirect.
  console.log("--- !!! MIDDLEWARE IS RUNNING !!! ---");
  return NextResponse.redirect(new URL("/login", request.url));
}

// We are still only targeting the admin pages for this test.
export const config = {
  matcher: "/admin/:path*",
};
