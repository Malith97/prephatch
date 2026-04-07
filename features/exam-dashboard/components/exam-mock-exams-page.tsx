import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { ExamMockList } from "../../exams/components/exam-mock-list";
import { getCanonicalMocks } from "../exam-dashboard-utils";

type ExamMockExamsPageProps = {
  examSlug: string;
};

export function ExamMockExamsPage({
  examSlug,
}: Readonly<ExamMockExamsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <ExamMockList mocks={getCanonicalMocks(exam)} />
    </main>
  );
}
