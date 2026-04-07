import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { getRecommendations } from "../exam-dashboard-utils";
import { RecommendedActionsPanel } from "./recommended-actions-panel";

type ExamRecommendationsPageProps = {
  examSlug: string;
};

export function ExamRecommendationsPage({
  examSlug,
}: Readonly<ExamRecommendationsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Recommendations"
          title="AI-ready suggestion space, starting with deterministic next steps."
          description="For now the recommendations are rules-first and reliable. This leaves room for future AI enhancement without making the workspace depend on it."
        />
      </section>

      <RecommendedActionsPanel recommendations={getRecommendations(exam)} />
    </main>
  );
}
