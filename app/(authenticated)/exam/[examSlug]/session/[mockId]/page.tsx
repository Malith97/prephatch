import Link from "next/link";

import { ExamSession } from "../../../../../../features/exams/components/exam-session";
import { getExamWorkspaceMock } from "../../../../../../features/exams/mock-exam-workspace";
import { getExamBySlug } from "../../../../../../server/exams/mock-repository";

type ExamSessionRouteProps = {
  params: {
    examSlug: string;
    mockId: string;
  };
};

export default function ExamSessionRoute({
  params,
}: ExamSessionRouteProps) {
  const exam = getExamBySlug(params.examSlug);
  const mock = getExamWorkspaceMock(params.examSlug, params.mockId);

  if (!exam || !mock) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-3 rounded-3xl p-8">
          <p className="ph-eyebrow">
            Mock not found
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">
            This mock exam is not available.
          </h1>
          <p className="text-sm leading-7 text-text-secondary">
            Return to the exam workspace and choose one of the available mock exams.
          </p>
        </div>
      </main>
    );
  }

  if (!mock.isLive) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-4 rounded-3xl p-8">
          <p className="ph-eyebrow">
            Mock coming soon
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">
            {mock.title} is not live yet.
          </h1>
          <p className="text-sm leading-7 text-text-secondary">{mock.note}</p>
          <Link
            href={`/exam/${params.examSlug}/mock-exams`}
            className="ph-btn ph-button-primary ph-hover-lift"
          >
            Back to mock exams
          </Link>
        </div>
      </main>
    );
  }

  return (
    <ExamSession
      exam={exam}
      mockId={mock.id}
      mockTitle={mock.title}
      backHref={`/exam/${exam.slug}/mock-exams`}
      resultsHref={`/exam/${exam.slug}/results`}
    />
  );
}
