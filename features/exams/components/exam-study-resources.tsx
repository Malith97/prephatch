import type {
  ExamWorkspaceCheatsheetItem,
  ExamWorkspaceResource,
  ExamWorkspaceWeakArea,
} from "../mock-exam-workspace";
import { ExamSectionHeading } from "./exam-section-heading";

type ExamStudyResourcesProps = {
  weakAreas: ExamWorkspaceWeakArea[];
  notes: ExamWorkspaceResource[];
  cheatsheet: ExamWorkspaceCheatsheetItem[];
  tips: ExamWorkspaceResource[];
};

export function ExamStudyResources({
  weakAreas,
  notes,
  cheatsheet,
  tips,
}: Readonly<ExamStudyResourcesProps>) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <ExamSectionHeading
          eyebrow="Weak areas"
          title="The concepts most likely to move the next score."
        />

        <div className="mt-6 space-y-4">
          {weakAreas.map((area) => (
            <article
              key={area.topic}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-text-primary">
                  {area.topic}
                </h3>
                <span className="ph-badge ph-badge-warning">
                  {area.signal}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{area.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4">
        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Notes"
            title="Short study notes to anchor the next review pass."
          />
          <div className="mt-6 grid gap-4">
            {notes.map((note) => (
              <article
                key={note.title}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <h3 className="text-base font-semibold text-text-primary">
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Cheatsheet"
            title="Quick recall items for the highest-frequency concepts."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cheatsheet.map((item) => (
              <article
                key={item.label}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <h3 className="text-base font-semibold text-text-primary">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="ph-surface-elevated rounded-[36px] p-6 sm:p-8">
          <ExamSectionHeading
            eyebrow="Tips"
            title="Small reminders that improve exam-time decision quality."
            inverted
          />
          <div className="mt-6 grid gap-4">
            {tips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
              >
                <h3 className="text-base font-semibold text-text-primary">{tip.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
