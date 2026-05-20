import Link from "next/link";

import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { getPracticeQuestionSets } from "../exam-dashboard-utils";

type ExamPracticeQuestionsPageProps = {
  examSlug: string;
  selectedSetId?: string;
};

export function ExamPracticeQuestionsPage({
  examSlug,
  selectedSetId,
}: Readonly<ExamPracticeQuestionsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return (
      <main className="space-y-5">
        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <p className="ph-eyebrow">Practice sets unavailable</p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary">
            This certification workspace could not be loaded.
          </h1>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Verify your certification access and try again.
          </p>
          <Link
            href="/dashboard/my-exams"
            className="ph-btn ph-button-primary ph-hover-lift mt-5"
          >
            Back to my exams
          </Link>
        </section>
      </main>
    );
  }

  const practiceSets = getPracticeQuestionSets(exam);
  const activeSetId =
    selectedSetId && practiceSets.some((set) => set.id === selectedSetId)
      ? selectedSetId
      : null;

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Practice questions"
          title="Short, targeted study loops without starting a timed mock attempt."
          description="Practice sets are lightweight drills for topic mastery. Mock exams remain full-length and timed with server-backed attempt tracking."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {practiceSets.map((practiceSet) => {
            const isSelected = activeSetId === practiceSet.id;

            return (
              <article
                key={practiceSet.id}
                className={`rounded-[28px] border p-5 shadow-subtle transition duration-200 ${
                  isSelected
                    ? "border-primary/35 bg-primary/10"
                    : "border-border/70 bg-bg/35"
                }`}
                aria-current={isSelected ? "step" : undefined}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ph-badge ph-badge-secondary">Practice mode</span>
                  {isSelected ? (
                    <span className="ph-badge ph-badge-primary">Selected</span>
                  ) : null}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">
                  {practiceSet.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {practiceSet.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="ph-badge ph-badge-neutral">
                      {practiceSet.questionCount} questions
                    </span>
                    <span className="ph-badge ph-badge-neutral">
                      ~{practiceSet.estimatedMinutes} minutes
                    </span>
                  </div>
                  <Link
                    href={practiceSet.ctaHref}
                    className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
                  >
                    {practiceSet.ctaLabel}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
