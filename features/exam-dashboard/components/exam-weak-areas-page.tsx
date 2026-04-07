import Link from "next/link";

import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { getWeakAreaScore } from "../exam-dashboard-utils";

type ExamWeakAreasPageProps = {
  examSlug: string;
};

export function ExamWeakAreasPage({
  examSlug,
}: Readonly<ExamWeakAreasPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Weak areas"
          title="The lowest-confidence topics for this certification path."
          description="Use this route when the goal is diagnosis and remediation, not package discovery."
        />

        <div className="mt-6 grid gap-4">
          {exam.weakAreas.map((area) => (
            <article
              key={area.topic}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {area.topic}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    {area.note}
                  </p>
                </div>
                <span className="ph-badge ph-badge-warning">
                  {area.signal}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-border/70">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,158,11,0.94),rgba(91,140,255,0.9))]"
                  style={{ width: `${Math.max(getWeakAreaScore(area), 14)}%` }}
                />
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/exam/${exam.slug}/notes`}
                  className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift w-full sm:w-auto"
                >
                  Open notes
                </Link>
                <Link
                  href={`/exam/${exam.slug}/mock-exams`}
                  className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift w-full sm:w-auto"
                >
                  Return to mocks
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
