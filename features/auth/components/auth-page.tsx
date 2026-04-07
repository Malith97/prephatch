import Link from "next/link";

import { SiteFooter } from "../../marketing/components/site-footer";
import { SiteHeader } from "../../marketing/components/site-header";

type AuthMode = "login" | "register";

type AuthPageProps = {
  mode: AuthMode;
};

const authContent: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    submitLabel: string;
    submitHref: string;
    alternateLabel: string;
    alternateHref: string;
    alternatePrompt: string;
  }
> = {
  login: {
    eyebrow: "Welcome back",
    title: "Return to your PrepHatch workspace.",
    description:
      "This is a front-end preview of the upcoming sign-in experience. It is intentionally backend-free for now, while the public product shell takes shape.",
    submitLabel: "Open dashboard preview",
    submitHref: "/dashboard",
    alternateLabel: "Create an account",
    alternateHref: "/register",
    alternatePrompt: "Need a new account?",
  },
  register: {
    eyebrow: "Create your access",
    title: "Start with a cleaner way to prepare.",
    description:
      "This registration surface is ready for public review now, even before live authentication is connected. The goal is to establish the feel and flow first.",
    submitLabel: "Create account preview",
    submitHref: "/dashboard",
    alternateLabel: "Sign in instead",
    alternateHref: "/login",
    alternatePrompt: "Already have an account?",
  },
};

const benefitPoints = [
  "Focused flows designed around confidence, not clutter.",
  "Premium mock experience direction with clear review loops.",
  "Standalone front-end implementation with no backend dependency.",
];

export function AuthPage({ mode }: AuthPageProps) {
  const content = authContent[mode];

  return (
    <div className="relative overflow-hidden">
      <div className="ph-animate-glow pointer-events-none absolute left-10 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-16 h-72 w-72 rounded-full bg-secondary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />

      <SiteHeader current={mode} />

      <main className="px-6 pb-16 pt-8 sm:pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="ph-surface-elevated rounded-[36px] p-8 sm:p-10">
            <div className="ph-badge ph-badge-secondary">
              {content.eyebrow}
            </div>
            <div className="mt-8 space-y-5">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
                {content.title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-text-secondary">
                {content.description}
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {benefitPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-sm font-semibold text-primary">
                      +
                    </span>
                    <p className="text-sm leading-7 text-text-secondary">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ph-surface rounded-[36px] p-8 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="ph-eyebrow">
                  Preview mode
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-text-primary">
                  {mode === "login" ? "Login" : "Register"}
                </h2>
              </div>
              <div className="ph-badge ph-badge-neutral">
                No backend required
              </div>
            </div>

            <form className="mt-8 space-y-5" aria-label={`${mode} preview form`}>
              {mode === "register" ? (
                <div className="space-y-2">
                  <label htmlFor="displayName" className="ph-field-label">
                    Full name
                  </label>
                  <input
                    id="displayName"
                    autoComplete="name"
                    type="text"
                    placeholder="Jane Learner"
                    className="ph-input"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="ph-field-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="ph-input"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="ph-field-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={
                    mode === "login" ? "Enter your password" : "Create a password"
                  }
                  className="ph-input"
                />
              </div>

              {mode === "register" ? (
                <label className="flex items-start gap-3 rounded-[24px] border border-border/70 bg-bg/38 px-4 py-4 text-sm leading-6 text-text-secondary shadow-subtle">
                  <input
                    type="checkbox"
                    className="ph-choice mt-1 h-4 w-4 rounded border-border/80 bg-surface/80"
                  />
                  <span>
                    Send occasional launch updates and product notes while the
                    authentication backend is still being wired.
                  </span>
                </label>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-3 text-text-secondary">
                    <input
                      type="checkbox"
                      className="ph-choice h-4 w-4 rounded border-border/80 bg-surface/80"
                    />
                    Remember this device
                  </label>
                  <span className="font-medium text-text-secondary/70">
                    Auth hooks coming next
                  </span>
                </div>
              )}

              <Link
                href={content.submitHref}
                className="ph-btn ph-button-primary ph-hover-lift w-full"
              >
                {content.submitLabel}
              </Link>
            </form>

            <div className="mt-6 rounded-[24px] border border-primary/20 bg-primary/10 px-5 py-4 text-sm leading-7 text-text-secondary">
              This page is intentionally static right now so the public-facing
              experience can be reviewed without any live auth or backend
              integration.
            </div>

            <p className="mt-6 text-sm text-text-secondary">
              {content.alternatePrompt}{" "}
              <Link
                href={content.alternateHref}
                className="font-semibold text-text-primary underline decoration-border underline-offset-4 transition duration-200 ease-premium hover:decoration-primary"
              >
                {content.alternateLabel}
              </Link>
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
