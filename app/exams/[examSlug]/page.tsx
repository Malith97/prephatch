import type { Metadata } from "next";

import { ExamDetailsPage } from "../../../features/exams/components/exam-details-page";
import { getMockExamWorkspace } from "../../../features/exams/mock-exam-workspace";

type ExamDetailRouteProps = {
  params: {
    examSlug: string;
  };
};

export async function generateMetadata({
  params,
}: ExamDetailRouteProps): Promise<Metadata> {
  const exam = getMockExamWorkspace(params.examSlug);

  return {
    title: exam ? `${exam.title} | PrepHatch` : "Exam Details | PrepHatch",
    description:
      exam?.overview.summary ??
      "Browse certification package details in PrepHatch.",
  };
}

export default function ExamDetailRoute({ params }: ExamDetailRouteProps) {
  return <ExamDetailsPage examSlug={params.examSlug} />;
}
