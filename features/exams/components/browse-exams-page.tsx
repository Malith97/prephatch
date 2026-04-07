import { PlatformShell } from "../../app-shell/components/platform-shell";
import { listMockExamCatalog } from "../mock-exam-catalog";
import { ExamCard } from "./exam-card";

const catalogHighlights = [
  { value: "4", label: "certification packages modeled" },
  { value: "3", label: "cloud providers represented" },
  { value: "1", label: "live working mock path today" },
];

export function BrowseExamsPage() {
  const exams = listMockExamCatalog();

  return (
    <PlatformShell>
      <main className="space-y-5">
        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <div className="ph-badge ph-badge-primary">
            Browse exams
          </div>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
                Choose the certification path that matches your next exam goal.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                The catalog is modeled to scale across providers and package
                types while still keeping the learner experience clear. Each
                package shows access state, price, progress, and a direct route
                into more detail.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {catalogHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
                >
                  <p className="text-3xl font-semibold text-text-primary">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ph-surface rounded-[36px] p-6 sm:p-8">
          <div className="space-y-2">
            <p className="ph-eyebrow">
              Certification catalog
            </p>
            <h2 className="text-2xl font-semibold text-text-primary">
              Provider-aware, progress-aware exam packages.
            </h2>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </section>
      </main>
    </PlatformShell>
  );
}
