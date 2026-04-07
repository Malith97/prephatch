import type { ReactNode } from "react";

import { ExamShell } from "../../../../../features/app-shell/components/exam-shell";

type ExamDashboardLayoutProps = {
  children: ReactNode;
  params: {
    examSlug: string;
  };
};

export default function ExamDashboardLayout({
  children,
  params,
}: Readonly<ExamDashboardLayoutProps>) {
  return <ExamShell examSlug={params.examSlug}>{children}</ExamShell>;
}
