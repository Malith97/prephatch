import type { Metadata } from "next";

import { ExamOverviewPage } from "../../../../../features/exam-dashboard/components/exam-overview-page";

type ExamOverviewRouteProps = {
  params: {
    examSlug: string;
  };
};

export async function generateMetadata({
  params,
}: ExamOverviewRouteProps): Promise<Metadata> {
  return {
    title: `Exam Overview | ${params.examSlug} | PrepHatch`,
    description: "Exam-specific overview workspace in PrepHatch.",
  };
}

export default function ExamOverviewRoute({
  params,
}: ExamOverviewRouteProps) {
  return <ExamOverviewPage examSlug={params.examSlug} />;
}
