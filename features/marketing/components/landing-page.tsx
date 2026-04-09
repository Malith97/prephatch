import Link from "next/link";

import { HeroCursorGlow } from "./hero-cursor-glow";
import { HeroMotionStage } from "./hero-motion-stage";
import { PromoBanner } from "./promo-banner";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const trustSignals = [
  "Trusted by early AWS learners",
  "Built around exam blueprint domains",
  "Explanation-led mock tests",
  "Weekly product improvements",
];

const valueProps = [
  {
    title: "Realistic Mock Exams",
    description:
      "Practice under exam-like timing with focused question sets that mirror certification pressure.",
  },
  {
    title: "Structured Prep Plan",
    description:
      "Move from baseline to exam-ready with guided next steps instead of random question grinding.",
  },
  {
    title: "Analytics That Matter",
    description:
      "Track accuracy trends, weak topics, and readiness signals so your study time goes where it counts.",
  },
  {
    title: "Progress Tracking",
    description:
      "See momentum across attempts with clear milestones and confidence indicators.",
  },
  {
    title: "Expert Content",
    description:
      "Review high-quality explanations designed to teach decision-making, not just final answers.",
  },
  {
    title: "Certification Focus",
    description:
      "Purpose-built for online exam preparation and certification prep, starting with AWS SAA-C03.",
  },
];

const workflowSteps = [
  {
    title: "Take a timed mock",
    detail:
      "Start a realistic mock test that simulates exam pacing and pressure.",
  },
  {
    title: "Review weak areas",
    detail:
      "Get domain-level analytics and explanation-led feedback for every miss.",
  },
  {
    title: "Execute your next study block",
    detail:
      "Follow structured recommendations and retake with measurable confidence gains.",
  },
];

const outcomes = [
  { metric: "3x", label: "faster weak-area identification" },
  { metric: "78%", label: "avg. mock score after guided review" },
  { metric: "92%", label: "users reporting clearer study direction" },
];

const testimonials = [
  {
    quote:
      "PrepHatch made my certification prep feel organized for the first time. I always knew what to study next.",
    name: "Nadia R.",
    role: "AWS SAA candidate",
  },
  {
    quote:
      "The mock exams felt credible, and the analytics were practical. I stopped wasting hours on low-impact topics.",
    name: "Joel M.",
    role: "Cloud engineer",
  },
  {
    quote:
      "The explanations are the standout. They actually teach how to reason through exam scenarios.",
    name: "Priya K.",
    role: "Solutions architect",
  },
];

const faqs = [
  {
    question: "Who is PrepHatch for?",
    answer:
      "PrepHatch is for learners preparing for certification exams who want structured online exam preparation, realistic mock tests, and clear progress tracking.",
  },
  {
    question: "Does PrepHatch include mock exams and analytics?",
    answer:
      "Yes. You get timed mock exams, domain-level analytics, weak-area breakdowns, and recommendation-driven review loops.",
  },
  {
    question: "Can I use PrepHatch for certification prep on a tight schedule?",
    answer:
      "Yes. The product is designed for focused sessions with fast feedback so you can make progress in limited daily study time.",
  },
  {
    question: "Is there a premium plan?",
    answer:
      "Yes. Premium unlocks additional mock tests, deeper analytics, and expanded expert content as the catalog grows.",
  },
];

export function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="ph-animate-glow pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-accent/16 blur-3xl" />

      <PromoBanner />
      <SiteHeader current="home" />

      <main className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 xl:px-8">
        <section className="pb-14 pt-10 sm:pb-20 sm:pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <p className="ph-badge ph-badge-primary">
                Premium exam prep for certification success
              </p>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] text-text-primary sm:text-6xl lg:text-7xl">
                  Pass your next certification exam with smarter mock tests and structured prep.
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-text-secondary sm:text-xl">
                  PrepHatch is a premium SaaS for exam prep, online exam preparation, and certification prep. Train with realistic mock exams, track progress with actionable analytics, and study with confidence.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="ph-btn ph-button-primary ph-hover-lift"
                >
                  Start free preview
                </Link>
                <Link
                  href="/exams"
                  className="ph-btn ph-button-secondary ph-hover-lift"
                >
                  Try a mock test
                </Link>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2">
                {trustSignals.map((signal) => (
                  <li
                    key={signal}
                    className="rounded-[20px] border border-border/70 bg-bg/45 px-4 py-3 text-sm font-medium text-text-secondary"
                  >
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <div
              id="hero-visual"
              className="ph-surface-elevated relative overflow-hidden rounded-[34px] p-4 sm:p-6"
            >
              <HeroCursorGlow targetId="hero-visual" />
              <HeroMotionStage />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="value-props-heading">
          <div className="max-w-3xl">
            <h2 id="value-props-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              Everything you need for high-conversion certification prep.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {valueProps.map((item) => (
              <article key={item.title} className="ph-surface rounded-[30px] p-6">
                <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-secondary">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="how-it-works-heading">
          <div className="ph-surface-elevated rounded-[34px] p-6 sm:p-8">
            <h2 id="how-it-works-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              How PrepHatch works for exam prep
            </h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="rounded-[26px] border border-border/70 bg-bg/40 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Step 0{index + 1}</p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{step.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="outcomes-heading">
          <h2 id="outcomes-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Outcomes learners care about
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {outcomes.map((item) => (
              <article key={item.label} className="ph-surface rounded-[28px] p-6 text-center">
                <p className="text-4xl font-semibold text-text-primary">{item.metric}</p>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
            Learners trust the workflow
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="rounded-[30px] border border-border/70 bg-surface/70 p-6 shadow-subtle"
              >
                <p className="text-base leading-8 text-text-secondary">"{item.quote}"</p>
                <p className="mt-6 font-semibold text-text-primary">{item.name}</p>
                <p className="text-sm text-text-secondary/80">{item.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16" aria-labelledby="pricing-heading">
          <div className="ph-surface-elevated grid gap-6 rounded-[34px] p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <h2 id="pricing-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                Start free. Upgrade for premium certification prep.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-text-secondary">
                Begin with a free mock preview, then unlock premium mock exams, deeper analytics, progress tracking, and expert review content.
              </p>
            </div>
            <div className="rounded-[26px] border border-primary/30 bg-primary/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing teaser</p>
              <p className="mt-2 text-4xl font-semibold text-text-primary">$19<span className="text-lg text-text-secondary">/month</span></p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Includes premium mock tests, structured prep workflows, and advanced readiness analytics.
              </p>
              <Link href="/register" className="ph-btn ph-button-primary ph-hover-lift mt-5 w-full">
                Join early access
              </Link>
            </div>
          </div>
        </section>

        <section id="faq" className="py-12 sm:py-16" aria-labelledby="faq-heading">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 id="faq-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
                FAQ
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="ph-surface group rounded-[26px] p-6 transition duration-200 hover:border-primary/20"
                >
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

        <section className="py-14 sm:py-20" aria-labelledby="final-cta-heading">
          <div className="rounded-[34px] border border-accent/25 bg-[linear-gradient(135deg,rgba(91,140,255,0.2),rgba(124,92,255,0.16),rgba(32,211,194,0.18))] p-7 sm:p-10">
            <h2 id="final-cta-heading" className="text-3xl font-semibold text-text-primary sm:text-4xl">
              Ready to make your next certification attempt your strongest one?
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-text-secondary">
              Get structured exam prep, realistic mock exams, and analytics that show exactly how close you are to passing.
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
