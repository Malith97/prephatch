import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";

type ExamCheatsheetsPageProps = {
  examSlug: string;
};

export function ExamCheatsheetsPage({
  examSlug,
}: Readonly<ExamCheatsheetsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Cheatsheets"
          title="Quick recall references for the highest-frequency concepts."
          description="Keep these compact so they work as exam-specific memory aids rather than full notes."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {exam.cheatsheet.map((item) => (
            <article
              key={item.label}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {item.label}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
