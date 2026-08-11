import Link from "next/link";

import { getExamBySlug } from "../../../server/exams/mock-repository";
import type { MockExam } from "../../../server/exams/types";
import type { ExamWorkspaceMock } from "../../exams/mock-exam-workspace";
import { ExamMockList } from "../../exams/components/exam-mock-list";

type ExamMockExamsPageProps = {
  examSlug: string;
  selectedMockId?: string;
};

function buildDbMock(exam: MockExam): ExamWorkspaceMock {
  const runtimeExam = exam as MockExam & { examVersionId?: string; packageTier?: string };
  const mockId = runtimeExam.examVersionId ?? exam.slug;

  return {
    id: mockId,
    title: exam.title,
    note: exam.description,
    mode: "Timed",
    status: exam.questions.length > 0 ? "Live" : "Coming soon",
    questions: exam.questions.length,
    duration: `${exam.durationMinutes} minutes`,
    access: runtimeExam.packageTier === "premium" ? "Entitlement required" : "Free",
    ctaLabel: exam.questions.length > 0 ? "Start free mock" : "View details",
    href: exam.questions.length > 0
      ? `/exam/${exam.slug}/session/${mockId}`
      : `/exam/${exam.slug}/mock-exams`,
    isLive: exam.questions.length > 0,
  };
}

export async function ExamMockExamsPage({
  examSlug,
  selectedMockId,
}: Readonly<ExamMockExamsPageProps>) {
  const exam = await getExamBySlug(examSlug, { includeAnswers: false });

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
      <ExamMockList mocks={[buildDbMock(exam)]} selectedMockId={selectedMockId} />
    </main>
  );
}
