import { redirect } from "next/navigation";

import { getExamBySlug } from "../../../../server/exams/mock-repository";
import type { MockExam } from "../../../../server/exams/types";

type SessionPageProps = {
  params: {
    examSlug: string;
  };
};

export default async function SessionPage({ params }: SessionPageProps) {
  const exam = await getExamBySlug(params.examSlug, { includeAnswers: false });

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

  const runtimeExam = exam as MockExam & { examVersionId?: string };
  const destination = `/exam/${params.examSlug}/session/${runtimeExam.examVersionId ?? exam.slug}`;
  console.info(
    `[routing] legacy_redirect from=/exams/${params.examSlug}/session to=${destination}`,
  );
  redirect(
    destination,
  );
}
