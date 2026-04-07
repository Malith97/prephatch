import { ExamTipsPage } from "../../../../../../features/exam-dashboard/components/exam-tips-page";

type ExamTipsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamTipsRoute({ params }: ExamTipsRouteProps) {
  return <ExamTipsPage examSlug={params.examSlug} />;
}
