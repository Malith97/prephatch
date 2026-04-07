import { SectionHeading } from "../../../components/section-heading";
import { getMockExamWorkspace } from "../../exams/mock-exam-workspace";

type ExamSettingsPageProps = {
  examSlug: string;
};

const settingCards = [
  {
    label: "Attempt preference",
    value: "Timed first",
    note: "Keep the default CTA pointed at timed mocks to reinforce exam realism.",
  },
  {
    label: "Review behavior",
    value: "Show weak areas after submit",
    note: "Preserve a clean handoff from results into diagnosis.",
  },
  {
    label: "Study reminders",
    value: "Twice weekly",
    note: "Leave room for future notification settings without mixing them into platform-level account preferences.",
  },
];

export function ExamSettingsPage({
  examSlug,
}: Readonly<ExamSettingsPageProps>) {
  const exam = getMockExamWorkspace(examSlug);

  if (!exam) {
    return null;
  }

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Exam settings"
          title={`Preferences for ${exam.title}.`}
          description="These settings are scoped to one certification workspace. Account-wide preferences remain under the platform dashboard."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {settingCards.map((setting) => (
            <article
              key={setting.label}
              className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">
                {setting.label}
              </p>
              <p className="mt-3 text-xl font-semibold text-text-primary">
                {setting.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {setting.note}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
