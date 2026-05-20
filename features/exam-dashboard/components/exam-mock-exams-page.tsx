import Link from "next/link";

import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { ExamMockList } from "../../exams/components/exam-mock-list";
import { getCanonicalMocks } from "../exam-dashboard-utils";

type ExamMockExamsPageProps = {
  examSlug: string;
  selectedMockId?: string;
};

export function ExamMockExamsPage({
  examSlug,
  selectedMockId,
}: Readonly<ExamMockExamsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return (
      <main className="space-y-5">
        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <p className="ph-eyebrow">Mock exams unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary">
            This certification workspace could not be loaded.
          </h1>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Verify your certification access and try again.
          </p>
          <Link
            href="/dashboard/my-exams"
            className="ph-btn ph-button-primary ph-hover-lift mt-5"
          >
            Back to my exams
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-5">
      <ExamMockList mocks={getCanonicalMocks(exam)} selectedMockId={selectedMockId} />
    </main>
  );
}
