import { cookies } from "next/headers";

import { createClient as createSupabaseServerClient } from "../../utils/supabase/server";
import { resolveDevBypassState } from "./dev-bypass";

export type AppRole = "student" | "instructor" | "admin" | "super_admin" | "unknown";
export type MembershipStatus = "invited" | "active" | "suspended" | "left" | "unknown";

export type AppSessionUser = {
  userId: string;
  email: string;
  role: AppRole;
  membershipStatus: MembershipStatus;
  organizationId: string | null;
  source: "supabase" | "dev_bypass";
};

type MembershipRecord = {
  organization_id: string;
  role: AppRole;
  status: MembershipStatus;
  joined_at?: string | null;
};

const ROLE_PRIORITY: AppRole[] = ["super_admin", "admin", "instructor", "student", "unknown"];

function roleRank(role: AppRole): number {
  const index = ROLE_PRIORITY.indexOf(role);
  return index === -1 ? ROLE_PRIORITY.length : index;
}

function normalizeRole(value: string | null | undefined): AppRole {
  if (value === "student" || value === "instructor" || value === "admin" || value === "super_admin") {
    return value;
  }

  return "unknown";
}

function normalizeMembershipStatus(value: string | null | undefined): MembershipStatus {
  if (value === "invited" || value === "active" || value === "suspended" || value === "left") {
    return value;
  }

  return "unknown";
}

function pickPrimaryMembership(memberships: MembershipRecord[]): MembershipRecord | null {
  if (memberships.length === 0) {
    return null;
  }

  const activeMemberships = memberships.filter((membership) => membership.status === "active");
  const pool = activeMemberships.length > 0 ? activeMemberships : memberships;

  return [...pool].sort((left, right) => {
    const roleDelta = roleRank(left.role) - roleRank(right.role);
    if (roleDelta !== 0) {
      return roleDelta;
    }

    const leftJoinedAt = left.joined_at ? Date.parse(left.joined_at) : Number.POSITIVE_INFINITY;
    const rightJoinedAt = right.joined_at ? Date.parse(right.joined_at) : Number.POSITIVE_INFINITY;
    return leftJoinedAt - rightJoinedAt;
  })[0] ?? null;
}

export function canAccessStudentViews(role: AppRole): boolean {
  return role === "student" || role === "unknown";
}

export function canAccessInstructorViews(role: AppRole): boolean {
  return role === "instructor" || role === "admin" || role === "super_admin";
}

export function formatRoleLabel(role: AppRole): string {
  if (role === "super_admin") {
    return "super admin";
  }

  return role;
}

export async function getAppSessionUser(): Promise<AppSessionUser | null> {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore);
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
      email: user.email ?? "unknown@prephatch.dev",
      role: primaryMembership?.role ?? "unknown",
      membershipStatus: primaryMembership?.status ?? "unknown",
      organizationId: primaryMembership?.organization_id ?? null,
      source: "supabase",
    };
  }

  const devBypassState = resolveDevBypassState();
  if (!devBypassState.enabled) {
    return null;
  }

  return {
    userId: "dev-bypass-user",
    email: process.env.DEV_BYPASS_EMAIL?.trim() || "dev-bypass@prephatch.dev",
    role: normalizeRole(process.env.DEV_BYPASS_ROLE),
    membershipStatus: "active",
    organizationId: process.env.DEV_BYPASS_ORGANIZATION_ID?.trim() || "dev-organization",
    source: "dev_bypass",
  };
}
