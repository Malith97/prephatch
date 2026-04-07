import { ResultsSummary } from "../../../../../../features/exams/components/results-summary";
import { getExamBySlug } from "../../../../../../server/exams/mock-repository";

type ExamAttemptResultsRouteProps = {
  params: {
    examSlug: string;
    attemptId: string;
  };
};

export default function ExamAttemptResultsRoute({
  params,
}: ExamAttemptResultsRouteProps) {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    return null;
  }

  return <ResultsSummary exam={exam} attemptId={params.attemptId} />;
}
