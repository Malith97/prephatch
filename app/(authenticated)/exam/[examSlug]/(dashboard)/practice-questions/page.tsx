import { ExamPracticeQuestionsPage } from "../../../../../../features/exam-dashboard/components/exam-practice-questions-page";

type ExamPracticeQuestionsRouteProps = {
  params: {
    examSlug: string;
  };
  searchParams?: {
    set?: string;
  };
};

export default function ExamPracticeQuestionsRoute({
  params,
  searchParams,
}: ExamPracticeQuestionsRouteProps) {
  const selectedSetId =
    typeof searchParams?.set === "string" && searchParams.set.trim().length > 0
      ? searchParams.set
      : undefined;

  return <ExamPracticeQuestionsPage examSlug={params.examSlug} selectedSetId={selectedSetId} />;
}
