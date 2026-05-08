import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { DevBypassState } from "./lib/auth/dev-bypass";
import { resolveDevBypassState } from "./lib/auth/dev-bypass";
import { createClient as createSupabaseMiddlewareClient } from "./utils/supabase/middleware";

const protectedRoots = ["/dashboard", "/exam", "/seller", "/exams"];
const devBypass = resolveDevBypassState();

function isProtectedPath(pathname: string): boolean {
  return protectedRoots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}

function buildLoginRedirectUrl(request: NextRequest): URL {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "next",
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
  );

  return loginUrl;
}

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get("ph_session")?.value);
}

function normalizeSearch(search: string | undefined): string {
  if (!search || search.length === 0) {
    return "no-query";
  }

  return search;
}

export type MiddlewareAccessInput = {
  pathname: string;
  method: string;
  search?: string;
  hasSession: boolean;
  devBypassState?: DevBypassState;
};

export type MiddlewareAccessDecision =
  | {
      kind: "next";
      bypassEnabled: boolean;
      bypassLogMessage?: string;
    }
  | {
      kind: "redirect";
    };

export function evaluateMiddlewareAccess(
  input: MiddlewareAccessInput,
): MiddlewareAccessDecision {
  if (!isProtectedPath(input.pathname)) {
    return {
      kind: "next",
      bypassEnabled: false,
    };
  }

  const resolvedDevBypass = input.devBypassState ?? devBypass;

  if (resolvedDevBypass.enabled) {
    return {
      kind: "next",
      bypassEnabled: true,
      bypassLogMessage:
        resolvedDevBypass.nodeEnv === "test"
          ? undefined
          : `[auth-bypass] ${input.method} ${input.pathname} (${normalizeSearch(input.search)})`,
    };
  }

  if (input.hasSession) {
    return {
      kind: "next",
      bypassEnabled: false,
    };
  }

  return {
    kind: "redirect",
  };
}

export function middleware(request: NextRequest) {
  const supabaseResponse = createSupabaseMiddlewareClient(request);

  const decision = evaluateMiddlewareAccess({
    pathname: request.nextUrl.pathname,
    method: request.method,
    search: request.nextUrl.search,
    hasSession: hasSessionCookie(request),
  });

  if (decision.kind === "redirect") {
    return NextResponse.redirect(buildLoginRedirectUrl(request));
  }

  if (decision.bypassLogMessage) {
    console.info(decision.bypassLogMessage);
  }

  const response = supabaseResponse;
  if (decision.bypassEnabled) {
    response.headers.set("x-prephatch-auth-bypass", "enabled");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/exam/:path*",
    "/seller/:path*",
    "/exams/:path*",
  ],
};
