import Link from "next/link";

import { dashboardData } from "../mock-data";

function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: Readonly<{
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}>) {
  return (
    <div className="space-y-2">
      <p className={inverted ? "ph-eyebrow-inverse" : "ph-eyebrow"}>{eyebrow}</p>
      <h2 className="ph-section-title">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-text-secondary">{description}</p> : null}
    </div>
  );
}

export function DashboardPage() {
  return (
    <main className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="ph-surface rounded-[30px] p-6 sm:p-8">
          <div className="ph-badge ph-badge-primary">Dashboard preview</div>
          <div className="mt-6 space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
              {dashboardData.welcome.greeting}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-text-secondary">{dashboardData.welcome.title}</p>
            <p className="max-w-3xl text-sm leading-7 text-text-secondary/80">{dashboardData.welcome.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/exams" className="ph-btn ph-button-primary ph-hover-lift">
              Browse exams
            </Link>
            <Link
              href="/exams/aws-saa-c03/mock/aws-saa-c03-free-preview"
              className="ph-btn ph-button-secondary ph-hover-lift"
            >
              Continue free mock
            </Link>
          </div>
        </div>

        <div className="ph-surface-elevated rounded-[30px] p-6 sm:p-8">
          <p className="ph-eyebrow-inverse">Readiness signal</p>
          <div className="mt-6 flex items-center gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/70 bg-bg/35 shadow-inner">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,rgba(42,124,255,0.96),rgba(20,184,166,0.84))] text-2xl font-semibold text-text-primary shadow-glow">
                {dashboardData.readiness.score}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">Current signal</p>
              <h2 className="text-3xl font-semibold text-text-primary">{dashboardData.readiness.label}</h2>
              <p className="text-sm leading-7 text-text-secondary">{dashboardData.readiness.note}</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/75">Next milestone</p>
            <p className="mt-2 text-sm leading-7 text-text-secondary">{dashboardData.readiness.target}</p>
          </div>
        </div>
      </section>

      <section className="ph-surface rounded-[30px] p-6 sm:p-8">
        <SectionHeading eyebrow="Progress summary" title="A quick read on momentum and access." />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardData.metrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
              <p className="text-sm font-medium text-text-secondary/75">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold text-text-primary">{metric.value}</p>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="ph-surface rounded-[30px] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Enrolled and purchased exams"
            title="Your current access state in one place."
          />
          <div className="mt-6 grid gap-4">
            {dashboardData.exams.map((exam) => (
              <article key={exam.title} className="rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{exam.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">{exam.detail}</p>
                  </div>
                  <span className="ph-badge ph-badge-neutral">{exam.access}</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">Status</p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{exam.status}</p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-surface-elevated/70 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/70">Progress</p>
                    <p className="mt-2 text-sm font-semibold text-text-primary">{exam.score}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="ph-surface rounded-[30px] p-6 sm:p-8">
            <SectionHeading eyebrow="Recent activity" title="Latest learner events" />
            <div className="mt-6 space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <article key={`${activity.title}-${activity.timestamp}`} className="rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-text-primary">{activity.title}</h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary/65">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">{activity.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="ph-surface-elevated rounded-[30px] p-6 sm:p-8">
            <SectionHeading
              eyebrow="Browse exams"
              title="Jump back into the catalog"
              description="Use the existing prototype list to start or continue exam work while deeper capabilities evolve."
              inverted
            />
            <Link href="/exams" className="ph-btn ph-button-primary ph-hover-lift mt-6">
              Open exam catalog
            </Link>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="ph-surface rounded-[30px] p-6 sm:p-8">
          <SectionHeading
            eyebrow="Weak areas snapshot"
            title="Topics likely to benefit from your next study block"
          />
          <div className="mt-6 space-y-4">
            {dashboardData.weakAreas.map((area) => (
              <article key={area.topic} className="rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-text-primary">{area.topic}</h3>
                  <span className="ph-badge ph-badge-warning">{area.accuracy}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{area.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ph-surface rounded-[30px] p-6 sm:p-8">
          <SectionHeading eyebrow="Quick actions" title="Keep the next move obvious" />
          <div className="mt-6 grid gap-4">
            {dashboardData.quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="ph-hover-lift rounded-xl border border-border/70 bg-bg/35 p-5 shadow-subtle transition duration-200 hover:border-primary/20 hover:bg-surface-elevated/70"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{action.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-text-secondary">{action.description}</p>
                  </div>
                  <span className="ph-btn ph-btn-sm ph-button-primary">Open</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
