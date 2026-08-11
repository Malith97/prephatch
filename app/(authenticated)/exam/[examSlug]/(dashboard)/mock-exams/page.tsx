import { ExamMockExamsPage } from "../../../../../../features/exam-dashboard/components/exam-mock-exams-page";

type ExamMockExamsRouteProps = {
  params: {
    examSlug: string;
  };
  searchParams?: {
    mock?: string;
  };
};

export default async function ExamMockExamsRoute({
  params,
  searchParams,
}: ExamMockExamsRouteProps) {
  const selectedMockId =
    typeof searchParams?.mock === "string" && searchParams.mock.trim().length > 0
      ? searchParams.mock
      : undefined;

  return ExamMockExamsPage({ examSlug: params.examSlug, selectedMockId });
}
