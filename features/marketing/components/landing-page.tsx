import Link from "next/link";

import {
  differentiators,
  faqs,
  studyCategories,
  testimonialPlaceholders,
  valueProps,
} from "../content";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const metrics = [
  { value: "01", label: "focused certification at launch" },
  { value: "10m", label: "preview timed mock already working" },
  { value: "UI", label: "clear next step on every screen" },
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="ph-animate-glow pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

      <SiteHeader current="home" />

      <main>
        <section className="px-6 pb-20 pt-10 sm:pb-24 sm:pt-16">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7 sm:space-y-8">
              <div className="inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800 shadow-[0_12px_30px_rgba(56,189,248,0.12)] backdrop-blur">
                Premium exam readiness, without the noise
              </div>

              <div className="space-y-5 sm:space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-slate-950 sm:text-6xl lg:text-7xl">
                  The modern study cockpit for high-stakes certification prep.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  PrepHatch is building a calmer, sharper way to prepare for
                  cloud certifications with timed mocks, trusted review, and a
                  readiness signal that helps learners know what to do next.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_44px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
                >
                  Register for early access
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 px-6 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
                >
                  Login preview
                </Link>
                <Link
                  href="/exams"
                  className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-slate-500 transition duration-200 hover:text-slate-950"
                >
                  See the working mock flow {"->"}
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.06)] backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-slate-950">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[36px] border border-white/60 bg-white/85 p-6 shadow-[0_34px_90px_rgba(15,23,42,0.12)] backdrop-blur">
                <div className="rounded-[28px] bg-slate-950 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                        Readiness overview
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold">
                        One focused workflow, designed to feel premium.
                      </h2>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                        Launch mode
                      </p>
                      <p className="mt-2 text-lg font-semibold">AWS SAA-C03</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                        Mock exam loop
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="h-2 rounded-full bg-white/10">
                          <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300" />
                        </div>
                        <p className="text-sm leading-6 text-slate-300">
                          Timed attempt, clean submit flow, and focused review in
                          one uninterrupted experience.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                        Review promise
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Explanations</span>
                          <span className="font-semibold text-white">Built in</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Readiness signal</span>
                          <span className="font-semibold text-white">Clear</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>Scope</span>
                          <span className="font-semibold text-white">Intentional</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ph-animate-float absolute -left-4 bottom-12 hidden w-52 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Timed mode
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Countdown visibility, calm pacing, and a direct path to
                  review.
                </p>
              </div>

              <div className="ph-animate-float-delayed absolute -right-3 top-10 hidden w-48 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Results
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Score summary, review context, and a clearer next move after
                  each attempt.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="value" className="px-6 py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-800">
                Value proposition
              </p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Built for learners who want signal, pace, and a product that
                feels considered.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {valueProps.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="differentiators" className="px-6 py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 rounded-[36px] border border-slate-200/70 bg-slate-950 px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.16)] sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                Differentiators
              </p>
              <h2 className="text-3xl font-semibold sm:text-4xl">
                A smaller product can feel better when the experience is more
                deliberate.
              </h2>
              <p className="text-sm leading-7 text-slate-300">
                PrepHatch is intentionally narrow right now, which makes it a
                stronger foundation for quality, clarity, and trust.
              </p>
            </div>

            <div className="grid gap-4">
              {differentiators.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-sky-200">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="categories" className="px-6 py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-800">
                Categories
              </p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                The first release stays tightly focused on the categories that
                show up in real architecture decision-making.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {studyCategories.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur"
                >
                  <div className="mb-5 h-14 w-14 rounded-[22px] bg-gradient-to-br from-sky-100 via-cyan-100 to-teal-100" />
                  <h3 className="text-xl font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-800">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                Social proof is planned into the surface even before the first
                beta quotes arrive.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {testimonialPlaceholders.map((item) => (
                <article
                  key={item.name}
                  className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur"
                >
                  <p className="text-base leading-8 text-slate-700">
                    "{item.quote}"
                  </p>
                  <div className="mt-8">
                    <p className="font-semibold text-slate-950">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-800">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                A clear preview now, deeper product layers next.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] backdrop-blur transition duration-200 hover:border-slate-200"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] text-lg font-semibold text-slate-950">
                    <span>{item.question}</span>
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
