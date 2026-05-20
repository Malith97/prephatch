import { ResultsSummary } from "../../../../../../features/exams/components/results-summary";
import { getExamBySlug } from "../../../../../../server/exams/mock-repository";

type ExamAttemptResultsRouteProps = {
  params: {
    examSlug: string;
    attemptId: string;
  };
};

export default async function ExamAttemptResultsRoute({
  params,
}: ExamAttemptResultsRouteProps) {
  const exam = await getExamBySlug(params.examSlug, { includeAnswers: false });

  if (!exam) {
    return null;
  }

  return <ResultsSummary exam={exam} attemptId={params.attemptId} />;
}
