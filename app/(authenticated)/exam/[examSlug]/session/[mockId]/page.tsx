import { ExamSession } from "../../../../../../features/exams/components/exam-session";
import { getExamBySlug } from "../../../../../../server/exams/mock-repository";
import type { MockExam } from "../../../../../../server/exams/types";

type ExamSessionRouteProps = {
  params: {
    examSlug: string;
    mockId: string;
  };
};

export default async function ExamSessionRoute({
  params,
}: ExamSessionRouteProps) {
  const exam = await getExamBySlug(params.examSlug, { includeAnswers: false });

  if (!exam) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-3 rounded-3xl p-8">
          <p className="ph-eyebrow">
            Exam not found
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

  const runtimeExam = exam as MockExam & { examVersionId?: string };
  const resolvedMockId = params.mockId || runtimeExam.examVersionId || exam.slug;

  return (
    <ExamSession
      exam={exam}
      mockId={resolvedMockId}
      mockTitle={exam.title}
      backHref={`/exam/${exam.slug}/mock-exams`}
      resultsHref={`/exam/${exam.slug}/results`}
    />
  );
}
