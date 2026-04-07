import { ExamWeakAreasPage } from "../../../../../../features/exam-dashboard/components/exam-weak-areas-page";

type ExamWeakAreasRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamWeakAreasRoute({
  params,
}: ExamWeakAreasRouteProps) {
  return <ExamWeakAreasPage examSlug={params.examSlug} />;
}
