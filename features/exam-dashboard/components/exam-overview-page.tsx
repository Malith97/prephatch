import Link from "next/link";

import { ExamLogoBadge } from "../../../components/exam-logo-badge";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import {
  getCanonicalResults,
  getRecommendations,
} from "../exam-dashboard-utils";
import { ExamProgressCard } from "./exam-progress-card";
import { RecentMockAttemptsList } from "./recent-mock-attempts-list";
import { RecommendedActionsPanel } from "./recommended-actions-panel";
import { WeakAreasChart } from "./weak-areas-chart";

type ExamOverviewPageProps = {
  examSlug: string;
};

export function ExamOverviewPage({
  examSlug,
}: Readonly<ExamOverviewPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  const recentResults = getCanonicalResults(exam);
  const recommendations = getRecommendations(exam);

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <ExamLogoBadge
                provider={exam.provider}
                certificationCode={exam.certificationCode}
              />
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="ph-badge ph-badge-secondary">
                    {exam.provider}
                  </span>
                  <span className="ph-badge ph-badge-neutral">
                    {exam.category}
                  </span>
                  <span className="ph-badge ph-badge-success">
                    {exam.ownershipLabel}
                  </span>
                </div>
                <div className="space-y-3">
                  <p className="ph-eyebrow">
                    {exam.certificationCode}
                  </p>
                  <h1 className="ph-display-title">
                    {exam.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-text-secondary">
                    {exam.overview.summary}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/exam/${exam.slug}/mock-exams`}
                className="ph-btn ph-button-primary ph-hover-lift w-full sm:w-auto"
              >
                Open mock exams
              </Link>
              <Link
                href={`/exam/${exam.slug}/analytics`}
                className="ph-btn ph-button-secondary ph-hover-lift w-full sm:w-auto"
              >
                Open analytics
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {exam.progressSummary.slice(0, 3).map((metric) => (
              <article
                key={metric.label}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                  {metric.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {metric.note}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ExamProgressCard exam={exam} />
        <WeakAreasChart weakAreas={exam.weakAreas} />
        <RecentMockAttemptsList results={recentResults} />
        <RecommendedActionsPanel recommendations={recommendations} />
      </section>
    </main>
  );
}
