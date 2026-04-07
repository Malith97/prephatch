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
      <div className="ph-animate-glow pointer-events-none absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-accent/18 blur-3xl" />

      <SiteHeader current="home" />

      <main>
        <section className="px-6 pb-20 pt-10 sm:pb-24 sm:pt-16">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7 sm:space-y-8">
              <div className="ph-badge ph-badge-primary">
                Premium exam readiness, without the noise
              </div>

              <div className="space-y-5 sm:space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-text-primary sm:text-6xl lg:text-7xl">
                  The modern study cockpit for high-stakes certification prep.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
                  PrepHatch is building a calmer, sharper way to prepare for
                  cloud certifications with timed mocks, trusted review, and a
                  readiness signal that helps learners know what to do next.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="ph-btn ph-button-primary ph-hover-lift"
                >
                  Register for early access
                </Link>
                <Link
                  href="/login"
                  className="ph-btn ph-button-secondary ph-hover-lift"
                >
                  Login preview
                </Link>
                <Link
                  href="/exams"
                  className="ph-btn ph-btn-link"
                >
                  See the working mock flow {"->"}
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="ph-surface rounded-[28px] p-5"
                  >
                    <p className="text-2xl font-semibold text-text-primary">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="ph-surface rounded-[36px] p-6">
                <div className="ph-surface-elevated rounded-[28px] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="ph-eyebrow-inverse">
                        Readiness overview
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-text-primary">
                        One focused workflow, designed to feel premium.
                      </h2>
                    </div>
                    <div className="rounded-2xl border border-border/70 bg-bg/35 px-4 py-3 text-right shadow-subtle">
                      <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/75">
                        Launch mode
                      </p>
                      <p className="mt-2 text-lg font-semibold text-text-primary">
                        AWS SAA-C03
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                      <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/75">
                        Mock exam loop
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="h-2 rounded-full bg-border/70">
                          <div className="h-2 w-4/5 rounded-full bg-[linear-gradient(90deg,rgba(91,140,255,1),rgba(124,92,255,0.92),rgba(32,211,194,0.88))]" />
                        </div>
                        <p className="text-sm leading-6 text-text-secondary">
                          Timed attempt, clean submit flow, and focused review in
                          one uninterrupted experience.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
                      <p className="text-xs uppercase tracking-[0.16em] text-text-secondary/75">
                        Review promise
                      </p>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>Explanations</span>
                          <span className="font-semibold text-text-primary">Built in</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>Readiness signal</span>
                          <span className="font-semibold text-text-primary">Clear</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-text-secondary">
                          <span>Scope</span>
                          <span className="font-semibold text-text-primary">Intentional</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ph-animate-float ph-surface absolute -left-4 bottom-12 hidden w-52 rounded-[28px] p-4 md:block">
                <p className="ph-eyebrow">
                  Timed mode
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Countdown visibility, calm pacing, and a direct path to
                  review.
                </p>
              </div>

              <div className="ph-animate-float-delayed ph-surface absolute -right-3 top-10 hidden w-48 rounded-[28px] p-4 md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Results
                </p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
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
              <p className="ph-eyebrow">
                Value proposition
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Built for learners who want signal, pace, and a product that
                feels considered.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {valueProps.map((item) => (
                <article
                  key={item.title}
                  className="ph-surface rounded-[32px] p-6"
                >
                  <p className="ph-eyebrow">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-text-secondary">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="differentiators" className="px-6 py-12 sm:py-16">
          <div className="ph-surface-elevated mx-auto grid w-full max-w-6xl gap-8 rounded-[36px] px-6 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-4">
              <p className="ph-eyebrow-inverse">
                Differentiators
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                A smaller product can feel better when the experience is more
                deliberate.
              </h2>
              <p className="text-sm leading-7 text-text-secondary">
                PrepHatch is intentionally narrow right now, which makes it a
                stronger foundation for quality, clarity, and trust.
              </p>
            </div>

            <div className="grid gap-4">
              {differentiators.map((item, index) => (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-sm font-semibold text-primary">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-text-secondary">
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
              <p className="ph-eyebrow">
                Categories
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                The first release stays tightly focused on the categories that
                show up in real architecture decision-making.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {studyCategories.map((item) => (
                <article
                  key={item.title}
                  className="ph-surface rounded-[30px] p-6"
                >
                  <div className="mb-5 h-14 w-14 rounded-[22px] bg-[linear-gradient(145deg,rgba(91,140,255,0.28),rgba(32,211,194,0.22))]" />
                  <h3 className="text-xl font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary">
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
              <p className="ph-eyebrow">
                Testimonials
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Social proof is planned into the surface even before the first
                beta quotes arrive.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {testimonialPlaceholders.map((item) => (
                <article
                  key={item.name}
                  className="rounded-[32px] border border-dashed border-border/80 bg-surface/70 p-6 shadow-subtle backdrop-blur"
                >
                  <p className="text-base leading-8 text-text-secondary">
                    "{item.quote}"
                  </p>
                  <div className="mt-8">
                    <p className="font-semibold text-text-primary">{item.name}</p>
                    <p className="text-sm text-text-secondary/75">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 py-12 sm:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="space-y-4">
              <p className="ph-eyebrow">
                FAQ
              </p>
              <h2 className="text-3xl font-semibold text-text-primary sm:text-4xl">
                A clear preview now, deeper product layers next.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="ph-surface group rounded-[28px] p-6 transition duration-200 hover:border-primary/20"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] text-lg font-semibold text-text-primary">
                    <span>{item.question}</span>
                    <span className="rounded-full border border-border/70 px-3 py-1 text-sm text-text-secondary transition duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">
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
