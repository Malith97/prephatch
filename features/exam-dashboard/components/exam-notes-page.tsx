import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";

type ExamNotesPageProps = {
  examSlug: string;
};

export function ExamNotesPage({ examSlug }: Readonly<ExamNotesPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Notes"
          title="Short study notes anchored to this exam only."
          description="These notes are part of the exam workspace, not the platform dashboard."
        />

        <div className="mt-6 grid gap-4">
          {exam.notes.map((note) => (
            <article
              key={note.title}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <h3 className="text-lg font-semibold text-text-primary">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {note.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
