import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import {
  getScoreTrend,
  getTopicMastery,
} from "../exam-dashboard-utils";
import { ScoreTrendChart } from "./score-trend-chart";
import { TopicMasteryChart } from "./topic-mastery-chart";
import { WeakAreasChart } from "./weak-areas-chart";

type ExamAnalyticsPageProps = {
  examSlug: string;
};

export function ExamAnalyticsPage({
  examSlug,
}: Readonly<ExamAnalyticsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Analytics"
          title="Performance charts for score trend, topic mastery, and weak areas."
          description="Everything on this route is exam-specific. No marketplace or cross-exam purchase decisions belong here."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ScoreTrendChart data={getScoreTrend(exam)} />
        <TopicMasteryChart data={getTopicMastery(exam)} />
      </section>

      <WeakAreasChart weakAreas={exam.weakAreas} />
    </main>
  );
}
