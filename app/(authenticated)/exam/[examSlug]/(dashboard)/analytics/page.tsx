import { ExamAnalyticsPage } from "../../../../../../features/exam-dashboard/components/exam-analytics-page";

type ExamAnalyticsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamAnalyticsRoute({
  params,
}: ExamAnalyticsRouteProps) {
  return <ExamAnalyticsPage examSlug={params.examSlug} />;
}
