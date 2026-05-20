import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicKey } from "../../server/db/supabase-env";

import { resolveDevBypassState } from "./dev-bypass";

const USER_HEADER = "x-prephatch-user-id";
const USER_COOKIE = "ph_user_id";
const ORG_HEADER = "x-prephatch-organization-id";
const ORG_COOKIE = "ph_org_id";
const DEV_BYPASS_USER_ID = "dev-bypass-user";

type RequestRole = "student" | "instructor" | "admin" | "super_admin" | "unknown";
type RequestMembershipStatus = "invited" | "active" | "suspended" | "left" | "unknown";

type MembershipRow = {
  organization_id: string;
  role: RequestRole;
  status: RequestMembershipStatus;
  joined_at?: string | null;
};

export type RequestUserContext = {
  userId: string;
  organizationId: string | null;
  role: RequestRole;
  membershipStatus: RequestMembershipStatus;
  email?: string;
  source: "header" | "cookie" | "supabase" | "dev_bypass";
};

function parseCookieValue(
  cookieHeader: string | null,
  key: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValueParts] = pair.split("=");
    const name = rawName.trim();

    if (name !== key) {
      continue;
    }

    const rawValue = rawValueParts.join("=").trim();
    if (!rawValue) {
      return null;
    }

    try {
      return decodeURIComponent(rawValue);
    } catch {
      return rawValue;
    }
  }

  return null;
}

function parseAllCookies(cookieHeader: string | null): Array<{ name: string; value: string }> {
  if (!cookieHeader) {
    return [];
  }

  return cookieHeader
    .split(";")
    .map((pair) => {
      const [rawName, ...rawValueParts] = pair.split("=");
      const name = rawName.trim();
      const value = rawValueParts.join("=").trim();
      return name && value ? { name, value } : null;
    })
    .filter((cookie): cookie is { name: string; value: string } => cookie !== null);
}

function normalizeRole(value: string | null | undefined): RequestRole {
  if (value === "student" || value === "instructor" || value === "admin" || value === "super_admin") {
    return value;
  }

  return "unknown";
}

function normalizeMembershipStatus(value: string | null | undefined): RequestMembershipStatus {
  if (value === "invited" || value === "active" || value === "suspended" || value === "left") {
    return value;
  }

  return "unknown";
}

function rankRole(role: RequestRole): number {
  if (role === "super_admin") {
    return 0;
  }
  if (role === "admin") {
    return 1;
  }
  if (role === "instructor") {
    return 2;
  }
  if (role === "student") {
    return 3;
  }

  return 4;
}

function pickPrimaryMembership(memberships: MembershipRow[]): MembershipRow | null {
  if (memberships.length === 0) {
    return null;
  }

  const activeMemberships = memberships.filter((membership) => membership.status === "active");
  const pool = activeMemberships.length > 0 ? activeMemberships : memberships;

  return [...pool].sort((left, right) => {
    const roleDelta = rankRole(left.role) - rankRole(right.role);
    if (roleDelta !== 0) {
      return roleDelta;
    }

    const leftJoined = left.joined_at ? Date.parse(left.joined_at) : Number.POSITIVE_INFINITY;
    const rightJoined = right.joined_at ? Date.parse(right.joined_at) : Number.POSITIVE_INFINITY;
    return leftJoined - rightJoined;
  })[0] ?? null;
}

function getRequiredPublicSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Please define it in .env.local.",
    );
  }

  return value;
}

function buildSupabaseServerClientForRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const cookiePairs = parseAllCookies(cookieHeader);

  return createServerClient(
    getRequiredPublicSupabaseUrl(),
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return cookiePairs;
        },
        setAll() {
          // Route handlers do not need to write refreshed cookies for this resolver.
        },
      },
    },
  );
}

export function resolveRequestUserId(request: Request): string | null {
  const headerUserId = request.headers.get(USER_HEADER)?.trim();
  if (headerUserId) {
    return headerUserId;
  }

  const cookieUserId = parseCookieValue(request.headers.get("cookie"), USER_COOKIE);
  if (cookieUserId) {
    return cookieUserId;
  }

  const devBypassState = resolveDevBypassState();
  if (devBypassState.enabled) {
    return DEV_BYPASS_USER_ID;
  }

  return null;
}

export async function resolveRequestUserContext(
  request: Request,
): Promise<RequestUserContext | null> {
  const cookieHeader = request.headers.get("cookie");

  const headerUserId = request.headers.get(USER_HEADER)?.trim();
  if (headerUserId) {
    return {
      userId: headerUserId,
      organizationId:
        request.headers.get(ORG_HEADER)?.trim() || parseCookieValue(cookieHeader, ORG_COOKIE),
      role: "unknown",
      membershipStatus: "active",
      source: "header",
    };
  }

  const cookieUserId = parseCookieValue(cookieHeader, USER_COOKIE);
  if (cookieUserId) {
    return {
      userId: cookieUserId,
      organizationId: parseCookieValue(cookieHeader, ORG_COOKIE),
      role: "unknown",
      membershipStatus: "active",
      source: "cookie",
    };
  }

  try {
    const supabase = buildSupabaseServerClientForRequest(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: membershipRows } = await supabase
        .from("organization_members")
        .select("organization_id, role, status, joined_at")
        .eq("user_id", user.id)
        .is("deleted_at", null);

      const memberships = (membershipRows ?? []).map((row) => ({
        organization_id: row.organization_id,
        role: normalizeRole(row.role),
        status: normalizeMembershipStatus(row.status),
        joined_at: row.joined_at,
      }));
      const primaryMembership = pickPrimaryMembership(memberships);

      return {
        userId: user.id,
        organizationId: primaryMembership?.organization_id ?? null,
        role: primaryMembership?.role ?? "unknown",
        membershipStatus: primaryMembership?.status ?? "unknown",
        email: user.email ?? undefined,
        source: "supabase",
      };
    }
  } catch {
    // Fall through to dev bypass.
  }

  const devBypassState = resolveDevBypassState();
  if (devBypassState.enabled) {
    return {
      userId: DEV_BYPASS_USER_ID,
      organizationId: process.env.DEV_BYPASS_ORGANIZATION_ID?.trim() || "dev-organization",
      role: normalizeRole(process.env.DEV_BYPASS_ROLE),
      membershipStatus: "active",
      email: process.env.DEV_BYPASS_EMAIL?.trim() || "dev-bypass@prephatch.dev",
      source: "dev_bypass",
    };
  }

  return null;
}
