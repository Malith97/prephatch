import Link from "next/link";

import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";
import { getPracticeQuestionSets } from "../exam-dashboard-utils";

type ExamPracticeQuestionsPageProps = {
  examSlug: string;
};

export function ExamPracticeQuestionsPage({
  examSlug,
}: Readonly<ExamPracticeQuestionsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  const practiceSets = getPracticeQuestionSets(exam);

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Practice questions"
          title="Focused sets built around topic coverage instead of full mocks."
          description="Use these targeted drills when you want a shorter study loop before returning to the full timed exams."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {practiceSets.map((practiceSet) => (
            <article
              key={practiceSet.id}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {practiceSet.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {practiceSet.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="ph-badge ph-badge-neutral">
                  {practiceSet.questionCount} questions
                </span>
                <Link
                  href={practiceSet.ctaHref}
                  className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
                >
                  Open mock exams
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
