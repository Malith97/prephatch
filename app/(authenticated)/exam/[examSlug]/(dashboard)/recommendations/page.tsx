import { ExamRecommendationsPage } from "../../../../../../features/exam-dashboard/components/exam-recommendations-page";

type ExamRecommendationsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamRecommendationsRoute({
  params,
}: ExamRecommendationsRouteProps) {
  return <ExamRecommendationsPage examSlug={params.examSlug} />;
}
