import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  canAccessStudentViews,
  getAppSessionUser,
} from "../../../../lib/auth/app-session";

type ExamRootLayoutProps = {
  children: ReactNode;
};

export default async function ExamRootLayout({
  children,
}: Readonly<ExamRootLayoutProps>) {
  const sessionUser = await getAppSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Role gate: certification runtime and study views are student-only.
  if (!canAccessStudentViews(sessionUser.role)) {
    redirect("/seller");
  }

  return <>{children}</>;
}
