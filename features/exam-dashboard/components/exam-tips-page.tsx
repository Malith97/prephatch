import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";

type ExamTipsPageProps = {
  examSlug: string;
};

export function ExamTipsPage({ examSlug }: Readonly<ExamTipsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface-elevated rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Tips"
          title="Exam-time reminders that sharpen decision quality."
          description="These stay scoped to this certification workspace."
          inverted
        />

        <div className="mt-6 grid gap-4">
          {exam.tips.map((tip) => (
            <article
              key={tip.title}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {tip.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {tip.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
