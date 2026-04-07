import { ExamMockExamsPage } from "../../../../../../features/exam-dashboard/components/exam-mock-exams-page";

type ExamMockExamsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamMockExamsRoute({
  params,
}: ExamMockExamsRouteProps) {
  return <ExamMockExamsPage examSlug={params.examSlug} />;
}
