import Link from "next/link";

import { AuthenticatedShell } from "../../app-shell/components/authenticated-shell";
import { getMockExamWorkspace } from "../mock-exam-workspace";
import { ExamMockList } from "./exam-mock-list";
import { ExamPreviousResults } from "./exam-previous-results";
import { ExamReadinessPanel } from "./exam-readiness-panel";
import { ExamSectionHeading } from "./exam-section-heading";
import { ExamStudyResources } from "./exam-study-resources";

const ownershipToneClasses = {
  owned: "border-emerald-200 bg-emerald-50 text-emerald-700",
  active: "border-sky-200 bg-sky-50 text-sky-800",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  comingSoon: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

type ExamDetailsPageProps = {
  examSlug: string;
};

export function ExamDetailsPage({ examSlug }: ExamDetailsPageProps) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return (
      <AuthenticatedShell>
        <main className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
            Exam not found
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            This certification package is not available.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Return to the catalog to browse the currently modeled certification
            tracks.
          </p>
          <Link
            href="/exams"
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to browse exams
          </Link>
        </main>
      </AuthenticatedShell>
    );
  }

  return (
    <AuthenticatedShell>
      <main className="space-y-5">
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
            <Link
              href="/exams"
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
            >
              Back to browse exams
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {exam.provider}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {exam.category}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${ownershipToneClasses[exam.ownershipTone]}`}
                  >
                    {exam.ownershipLabel}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {exam.certificationCode}
                  </p>
                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                    {exam.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
                    {exam.overview.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={exam.primaryCta.href}
                    className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
                  >
                    {exam.primaryCta.label}
                  </Link>
                  <Link
                    href={exam.secondaryCta.href}
                    className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
                  >
                    {exam.secondaryCta.label}
                  </Link>
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200/80 bg-slate-50/90 p-6">
                <ExamSectionHeading
                  eyebrow="Exam overview"
                  title="Package snapshot"
                  description={exam.overview.audience}
                />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Price
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {exam.priceLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Access state
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {exam.ownershipLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Package scope
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {exam.mockCountLabel}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Format
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">
                      {exam.formatLabel}
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    Focus areas
                  </p>
                  <div className="mt-3 space-y-3">
                    {exam.overview.focusAreas.map((focusArea) => (
                      <p key={focusArea} className="text-sm leading-7 text-slate-600">
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

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <ExamSectionHeading
            eyebrow="Progress summary"
            title="A high-level view of confidence, activity, and package momentum."
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {exam.progressSummary.map((metric) => (
              <article
                key={metric.label}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5"
              >
                <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-950">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{metric.note}</p>
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
    </AuthenticatedShell>
  );
}
