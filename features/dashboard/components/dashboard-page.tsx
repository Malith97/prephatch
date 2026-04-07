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
      <p
        className={`text-sm font-semibold uppercase tracking-[0.18em] ${
          inverted ? "text-sky-200" : "text-sky-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-2xl font-semibold ${
          inverted ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`max-w-2xl text-sm leading-7 ${
            inverted ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function DashboardPage() {
  return (
    <main className="space-y-4">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-800">
            Dashboard preview
          </div>
          <div className="mt-6 space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              {dashboardData.welcome.greeting}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-600">
              {dashboardData.welcome.title}
            </p>
            <p className="max-w-3xl text-sm leading-7 text-slate-500">
              {dashboardData.welcome.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/exams"
              className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
              Browse exams
            </Link>
            <Link
              href="/exams/aws-saa-c03/mock/aws-saa-c03-free-preview"
              className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
            >
              Continue free mock
            </Link>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
            Readiness widget
          </p>
          <div className="mt-6 flex items-center gap-5">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-inner">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-300 to-teal-300 text-2xl font-semibold text-slate-950">
                {dashboardData.readiness.score}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                Current signal
              </p>
              <h2 className="text-3xl font-semibold">
                {dashboardData.readiness.label}
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                {dashboardData.readiness.note}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
              Next milestone
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {dashboardData.readiness.target}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
        <SectionHeading
          eyebrow="Progress summary"
          title="A quick read on momentum and access."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardData.metrics.map((metric) => (
            <article
              key={metric.label}
              className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5"
            >
              <p className="text-sm font-medium text-slate-500">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {metric.value}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{metric.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <SectionHeading
            eyebrow="Enrolled and purchased exams"
            title="Your current access state in one place."
          />
          <div className="mt-6 grid gap-4">
            {dashboardData.exams.map((exam) => (
              <article
                key={exam.title}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">
                      {exam.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {exam.detail}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {exam.access}
                  </span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {exam.status}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Progress
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">
                      {exam.score}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
            <SectionHeading
              eyebrow="Recent activity"
              title="The latest learner events."
            />
            <div className="mt-6 space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <article
                  key={`${activity.title}-${activity.timestamp}`}
                  className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-slate-950">
                      {activity.title}
                    </h3>
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {activity.detail}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:p-8">
            <SectionHeading
              eyebrow="Browse exams"
              title="Jump back into the catalog."
              description="Use the existing prototype list to start or continue exam work while the deeper product shell evolves."
              inverted
            />
            <Link
              href="/exams"
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Open exam catalog
            </Link>
          </section>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <SectionHeading
            eyebrow="Weak areas snapshot"
            title="The topics most likely to benefit from the next study block."
          />
          <div className="mt-6 space-y-4">
            {dashboardData.weakAreas.map((area) => (
              <article
                key={area.topic}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-950">
                    {area.topic}
                  </h3>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                    {area.accuracy}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {area.note}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur sm:p-8">
          <SectionHeading
            eyebrow="Quick actions"
            title="Keep the next move obvious."
          />
          <div className="mt-6 grid gap-4">
            {dashboardData.quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-[28px] border border-slate-200/80 bg-slate-50/90 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white active:translate-y-0"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {action.description}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
