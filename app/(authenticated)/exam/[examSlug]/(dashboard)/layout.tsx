import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  canAccessStudentViews,
  getAppSessionUser,
} from "../../../../../lib/auth/app-session";
import { ExamShell } from "../../../../../features/app-shell/components/exam-shell";

type ExamDashboardLayoutProps = {
  children: ReactNode;
  params: {
    examSlug: string;
  };
};

export default async function ExamDashboardLayout({
  children,
  params,
}: Readonly<ExamDashboardLayoutProps>) {
  const sessionUser = await getAppSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Role gate: exam dashboard content is reserved for student-facing users.
  if (!canAccessStudentViews(sessionUser.role)) {
    redirect("/seller");
  }

  return <ExamShell sessionUser={sessionUser} examSlug={params.examSlug}>{children}</ExamShell>;
}
