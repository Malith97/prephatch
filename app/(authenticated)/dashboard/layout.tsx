import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  canAccessStudentViews,
  getAppSessionUser,
} from "../../../lib/auth/app-session";
import { PlatformShell } from "../../../features/app-shell/components/platform-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const sessionUser = await getAppSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Role gate: student-facing dashboard must remain inaccessible to instructor/admin roles.
  if (!canAccessStudentViews(sessionUser.role)) {
    redirect("/seller");
  }

  return <PlatformShell sessionUser={sessionUser}>{children}</PlatformShell>;
}
