import { ResultsSummary } from "../../../../../features/exams/components/results-summary";
import { getExamBySlug } from "../../../../../server/exams/mock-repository";

type AttemptResultsPageProps = {
  params: {
    examSlug: string;
    attemptId: string;
  };
};

export default function AttemptResultsPage({
  params,
}: AttemptResultsPageProps) {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
        <div className="ph-surface space-y-3 rounded-3xl p-8">
          <p className="ph-eyebrow">
            Exam not found
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">
            This results page is not available.
          </h1>
          <p className="text-sm leading-7 text-text-secondary">
            Return to the exam selection page and launch a valid local mock.
          </p>
        </div>
      </main>
    );
  }

  return <ResultsSummary exam={exam} attemptId={params.attemptId} />;
}
