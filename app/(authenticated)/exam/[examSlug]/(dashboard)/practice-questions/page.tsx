import { ExamPracticeQuestionsPage } from "../../../../../../features/exam-dashboard/components/exam-practice-questions-page";

type ExamPracticeQuestionsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamPracticeQuestionsRoute({
  params,
}: ExamPracticeQuestionsRouteProps) {
  return <ExamPracticeQuestionsPage examSlug={params.examSlug} />;
}
