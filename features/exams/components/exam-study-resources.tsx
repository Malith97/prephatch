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
      <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
        <ExamSectionHeading
          eyebrow="Weak areas"
          title="The concepts most likely to move the next score."
        />

        <div className="mt-6 space-y-4">
          {weakAreas.map((area) => (
            <article
              key={area.topic}
              className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-950">
                  {area.topic}
                </h3>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                  {area.signal}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{area.note}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4">
        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <ExamSectionHeading
            eyebrow="Notes"
            title="Short study notes to anchor the next review pass."
          />
          <div className="mt-6 grid gap-4">
            {notes.map((note) => (
              <article
                key={note.title}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
              >
                <h3 className="text-base font-semibold text-slate-950">
                  {note.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{note.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <ExamSectionHeading
            eyebrow="Cheatsheet"
            title="Quick recall items for the highest-frequency concepts."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cheatsheet.map((item) => (
              <article
                key={item.label}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5"
              >
                <h3 className="text-base font-semibold text-slate-950">
                  {item.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-8">
          <ExamSectionHeading
            eyebrow="Tips"
            title="Small reminders that improve exam-time decision quality."
            inverted
          />
          <div className="mt-6 grid gap-4">
            {tips.map((tip) => (
              <article
                key={tip.title}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5"
              >
                <h3 className="text-base font-semibold text-white">{tip.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
