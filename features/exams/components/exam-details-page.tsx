import Link from "next/link";

import { PlatformShell } from "../../app-shell/components/platform-shell";
import { getMockExamWorkspace } from "../mock-exam-workspace";
import { ExamMockList } from "./exam-mock-list";
import { ExamPreviousResults } from "./exam-previous-results";
import { ExamReadinessPanel } from "./exam-readiness-panel";
import { ExamSectionHeading } from "./exam-section-heading";
import { ExamStudyResources } from "./exam-study-resources";

const ownershipToneClasses = {
  owned: "ph-badge ph-badge-success",
  active: "ph-badge ph-badge-primary",
  neutral: "ph-badge ph-badge-neutral",
  comingSoon: "ph-badge ph-badge-warning",
} as const;

type ExamDetailsPageProps = {
  examSlug: string;
};

export function ExamDetailsPage({ examSlug }: ExamDetailsPageProps) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return (
      <PlatformShell>
        <main className="ph-surface rounded-[36px] p-8">
          <p className="ph-eyebrow">
            Exam not found
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-text-primary">
            This certification package is not available.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
            Return to the catalog to browse the currently modeled certification
            tracks.
          </p>
          <Link
            href="/exams"
            className="ph-btn ph-button-primary ph-hover-lift mt-6"
          >
            Back to browse exams
          </Link>
        </main>
      </PlatformShell>
    );
  }

  return (
    <PlatformShell>
      <main className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="ph-surface rounded-[36px] p-6 sm:p-8">
            <Link
              href="/exams"
              className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
            >
              Back to browse exams
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="ph-badge ph-badge-secondary">
                    {exam.provider}
                  </span>
                  <span className="ph-badge ph-badge-neutral">
                    {exam.category}
                  </span>
                  <span className={ownershipToneClasses[exam.ownershipTone]}>
                    {exam.ownershipLabel}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="ph-eyebrow">
                    {exam.certificationCode}
                  </p>
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
                    {exam.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                    {exam.overview.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={exam.primaryCta.href}
                    className="ph-btn ph-button-primary ph-hover-lift"
                  >
                    {exam.primaryCta.label}
                  </Link>
                  <Link
                    href={exam.secondaryCta.href}
                    className="ph-btn ph-button-secondary ph-hover-lift"
                  >
                    {exam.secondaryCta.label}
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-border/70 bg-bg/35 p-6 shadow-subtle">
                <ExamSectionHeading
                  eyebrow="Exam overview"
                  title="Package snapshot"
                  description={exam.overview.audience}
                />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                      Price
                    </p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">
                      {exam.priceLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                      Access state
                    </p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">
                      {exam.ownershipLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                      Package scope
                    </p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">
                      {exam.mockCountLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                      Format
                    </p>
                    <p className="mt-2 text-lg font-semibold text-text-primary">
                      {exam.formatLabel}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] border border-border/70 bg-surface-elevated/70 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                    Focus areas
                  </p>
                  <div className="mt-3 space-y-3">
                    {exam.overview.focusAreas.map((focusArea) => (
                      <p key={focusArea} className="text-sm leading-7 text-text-secondary">
                        {focusArea}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ExamReadinessPanel readiness={exam.readiness} />
        </section>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Progress summary"
            title="A high-level view of confidence, activity, and package momentum."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {exam.progressSummary.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <p className="text-sm font-medium text-text-secondary/75">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-text-primary">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{metric.note}</p>
              </article>
            ))}
          </div>
        </section>

        <ExamMockList mocks={exam.mockExams} />

        <ExamPreviousResults results={exam.previousResults} />

        <ExamStudyResources
          weakAreas={exam.weakAreas}
          notes={exam.notes}
          cheatsheet={exam.cheatsheet}
          tips={exam.tips}
        />
      </main>
    </PlatformShell>
  );
}
