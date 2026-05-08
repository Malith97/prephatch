import Link from "next/link";

import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionStage } from "./hero-motion-stage";
import { PromoBanner } from "./promo-banner";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const trustSignals = [
  "Built around certification blueprint domains",
  "Timed mock runtime with server-backed autosave",
  "Weak-area analytics with action recommendations",
  "Continuous product updates for exam realism",
];

const valueProps = [
  {
    title: "Exam-Real Mock Sessions",
    description:
      "Practice inside a focused exam workspace with timer pressure, review flags, and answer persistence.",
  },
  {
    title: "Actionable Diagnostics",
    description:
      "Get topic-level score distribution, weak-area prioritization, and confidence signals after each attempt.",
  },
  {
    title: "Structured Study Loop",
    description:
      "Move from mock attempt to guided review to targeted retake without context switching.",
  },
  {
    title: "Clarity-First Dashboard",
    description:
      "Track readiness, momentum, and upcoming milestones from one learner-centric control surface.",
  },
  {
    title: "Marketplace + Ownership Model",
    description:
      "Discover certification packages, purchase securely, and manage owned exam workspaces in one platform.",
  },
  {
    title: "Scalable for AI Coaching",
    description:
      "Architecture is ready for AI explanations, adaptive practice plans, and richer decision support.",
  },
];

const workflowSteps = [
  {
    title: "Run a timed mock",
    detail:
      "Simulate exam conditions with realistic pacing, question navigation, and autosaved responses.",
  },
  {
    title: "Review diagnostic insights",
    detail:
      "Inspect score composition, weak domains, and recommendation cards tailored to your latest attempt.",
  },
  {
    title: "Retake with precision",
    detail:
      "Use focused actions to close knowledge gaps before launching the next timed run.",
  },
];

const outcomes = [
  { metric: "3x", label: "faster weak-area identification" },
  { metric: "78%", label: "average score after guided review cycles" },
  { metric: "92%", label: "learners reporting clearer study direction" },
];

const testimonials = [
  {
    quote:
      "PrepHatch made my prep feel organized. I stopped guessing what to study and started executing a clear plan.",
    name: "Nadia R.",
    role: "AWS SAA candidate",
  },
  {
    quote:
      "The exam runtime feels serious and the analytics are practical. I can see where I lose marks and why.",
    name: "Joel M.",
    role: "Cloud engineer",
  },
  {
    quote:
      "The review flow is the difference-maker. It turns every mock into a structured improvement cycle.",
    name: "Priya K.",
    role: "Solutions architect",
  },
];

const faqs = [
  {
    question: "Who is PrepHatch designed for?",
    answer:
      "PrepHatch is built for certification learners who want exam realism, low-noise analytics, and structured next steps instead of random practice.",
  },
  {
    question: "Does PrepHatch include timed mocks and topic analytics?",
    answer:
      "Yes. You get timed mock sessions, score breakdowns, weak-area analysis, and recommendation-driven review workflows.",
  },
  {
    question: "Can I use PrepHatch with limited daily study time?",
    answer:
      "Yes. The platform is optimized for focused sessions and quick, high-signal feedback loops.",
  },
  {
    question: "What unlocks in premium access?",
    answer:
      "Premium access unlocks expanded mock libraries, deeper analytics, and broader certification package coverage.",
  },
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="ph-animate-glow pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-secondary/16 blur-3xl" />

      <PromoBanner />
      <SiteHeader current="home" />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-surface focus:px-4 focus:py-2 focus:text-text-primary"
      >
        Skip to main content
      </a>

      <main id="main-content" className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 xl:px-8">
        <section className="pb-12 pt-8 sm:pb-18 sm:pt-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="ph-badge ph-badge-primary">Next-generation certification prep platform</p>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold leading-[0.94] text-text-primary sm:text-6xl">
                  Prepare with a modern exam workspace, not scattered study tools.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                  PrepHatch combines timed mock exams, clarity-first analytics, and focused review flows to
                  reduce cognitive load and accelerate certification readiness.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="ph-btn ph-button-primary ph-hover-lift">
                  Start free preview
                </Link>
                <Link href="/exams" className="ph-btn ph-button-secondary ph-hover-lift">
                  Explore mock catalog
                </Link>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {trustSignals.map((signal) => (
                  <li
                    key={signal}
                    className="rounded-xl border border-border/70 bg-bg/40 px-4 py-3 text-sm font-medium text-text-secondary"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <div id="hero-visual" className="ph-surface-elevated relative overflow-hidden rounded-[30px] p-4 sm:p-6">
              <HeroCursorGlow targetId="hero-visual" />
              <HeroMotionStage />
            </div>
          </div>
        </section>

        <section id="value-props" className="py-10 sm:py-14" aria-labelledby="value-props-heading">
          <div className="max-w-3xl">
            <h2 id="value-props-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              One cohesive product surface from prep kickoff to readiness confidence.
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {valueProps.map((item) => (
              <article key={item.title} className="ph-surface rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-10 sm:py-14" aria-labelledby="how-it-works-heading">
          <div className="ph-surface-elevated rounded-[30px] p-6 sm:p-8">
            <h2 id="how-it-works-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              How the PrepHatch workflow compounds progress
            </h2>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="rounded-xl border border-border/70 bg-bg/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Step {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="outcomes" className="py-10 sm:py-14" aria-labelledby="outcomes-heading">
          <h2 id="outcomes-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Outcomes learners track every week
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {outcomes.map((item) => (
              <article key={item.label} className="ph-surface rounded-2xl p-6 text-center">
                <p className="text-4xl font-semibold text-text-primary">{item.metric}</p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Learner proof from real prep cycles
          </h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="ph-surface rounded-2xl p-6">
                <p className="text-base leading-8 text-text-secondary">"{item.quote}"</p>
                <p className="mt-6 font-semibold text-text-primary">{item.name}</p>
                <p className="text-sm text-text-secondary/85">{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-14" aria-labelledby="pricing-heading">
          <div className="ph-surface-elevated grid gap-6 rounded-[30px] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h2 id="pricing-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Start free. Upgrade when you want deeper exam intelligence.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
                Begin with free previews, then unlock richer mock libraries, deeper diagnostics,
                and advanced learner workflows.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/12 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing preview</p>
              <p className="mt-2 text-4xl font-semibold text-text-primary">
                $19<span className="text-lg text-text-secondary">/month</span>
              </p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Includes premium timed mocks, topic diagnostics, recommendation engine, and progress analytics.
              </p>
              <Link href="/register" className="ph-btn ph-button-primary ph-hover-lift mt-5 w-full">
                Join early access
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="py-10 sm:py-14" aria-labelledby="faq-heading">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 id="faq-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                FAQ
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details key={item.question} className="ph-surface group rounded-2xl p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-text-primary">
                    <span>{item.question}</span>
                    <span className="rounded-full border border-border/70 px-3 py-1 text-sm text-text-secondary transition duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-text-secondary">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="final-cta-heading">
          <div className="rounded-[30px] border border-secondary/30 bg-[linear-gradient(135deg,rgba(42,124,255,0.2),rgba(20,184,166,0.18),rgba(248,113,113,0.16))] p-7 sm:p-10">
            <h2 id="final-cta-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              Ready to make your next certification attempt your strongest one?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
              Build momentum with a modern prep stack designed for concentration, consistency, and measurable improvement.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/register" className="ph-btn ph-button-primary ph-hover-lift">
                Start free preview
              </Link>
              <Link href="/login" className="ph-btn ph-button-secondary ph-hover-lift">
                Open login preview
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
