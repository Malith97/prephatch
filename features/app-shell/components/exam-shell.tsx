import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ExamLogoBadge } from "../../../components/exam-logo-badge";
import type { AppSessionUser } from "../../../lib/auth/app-session";
import { AuthenticatedShell } from "./authenticated-shell";
import { getExamNavigationItems } from "../navigation";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";

type ExamShellProps = {
  children: ReactNode;
  examSlug: string;
  sessionUser: AppSessionUser;
};

export function ExamShell({ children, examSlug, sessionUser }: Readonly<ExamShellProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    notFound();
  }

  return (
    <AuthenticatedShell
      sessionUser={sessionUser}
      navigationItems={getExamNavigationItems(exam.slug, sessionUser.role)}
      headerEyebrow="Exam workspace"
      headerTitle={`${exam.title} workspace`}
      headerDescription="This layer owns one certification only: mocks, analytics, weak areas, notes, cheatsheets, tips, and recommendations."
      headerActions={
        <>
          <span className="ph-badge ph-badge-success">
            {exam.ownershipLabel}
          </span>
          <Link
            href="/dashboard"
            className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
          >
            Platform dashboard
          </Link>
        </>
      }
      railPanel={
        <div className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
          <div className="flex items-start gap-4">
            <ExamLogoBadge
              provider={exam.provider}
              certificationCode={exam.certificationCode}
            />
            <div className="space-y-2">
              <p className="ph-eyebrow-inverse">
                {exam.provider}
              </p>
              <p className="text-lg font-semibold text-text-primary">
                {exam.title}
              </p>
              <p className="text-sm leading-6 text-text-secondary">
                {exam.overview.summary}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="ph-badge ph-badge-secondary">
              {exam.category}
            </span>
            <span className="ph-badge ph-badge-primary">
              {exam.readiness.label}
            </span>
            <span className="ph-badge ph-badge-neutral">
              {exam.mockCountLabel}
            </span>
          </div>
        </div>
      }
    >
      {children}
    </AuthenticatedShell>
  );
}
