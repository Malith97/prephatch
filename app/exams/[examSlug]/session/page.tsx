import { redirect } from "next/navigation";

import { getDefaultLiveMock } from "../../../../features/exams/mock-exam-workspace";
import { getExamBySlug } from "../../../../server/exams/mock-repository";

type SessionPageProps = {
  params: {
    examSlug: string;
  };
};

export default function SessionPage({ params }: SessionPageProps) {
  const exam = getExamBySlug(params.examSlug);
  const defaultMock = getDefaultLiveMock(params.examSlug);

  if (!exam) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-3 rounded-3xl p-8">
          <p className="ph-eyebrow">
            Exam not found
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">
            This local mock does not exist.
          </h1>
          <p className="text-sm leading-7 text-text-secondary">
            Check the exam selection page and start one of the available local
            mocks.
          </p>
        </div>
      </main>
    );
  }

  redirect(
    defaultMock
      ? `/exam/${params.examSlug}/session/${defaultMock.id}`
      : `/exam/${params.examSlug}/mock-exams`,
  );
}
