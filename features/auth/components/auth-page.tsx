import Link from "next/link";

import { SiteFooter } from "../../marketing/components/site-footer";
import { SiteHeader } from "../../marketing/components/site-header";

type AuthMode = "login" | "register";

type AuthPageProps = {
  mode: AuthMode;
};

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      role="img"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.8 3-4.4 3-7.4 0-.7-.1-1.2-.2-1.8H12Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.9-.9 6.5-2.5l-3.2-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.5-1.7-5.3-3.9H3.4v2.5A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.7 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1V7.4H3.4A10 10 0 0 0 2.3 12c0 1.7.4 3.3 1.1 4.6l3.3-2.5Z"
      />
      <path
        fill="#4285F4"
        d="M12 6c1.4 0 2.6.5 3.6 1.4l2.7-2.7C16.9 3.4 14.7 2.5 12 2.5A10 10 0 0 0 3.4 7.4l3.3 2.5C7.5 7.7 9.5 6 12 6Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      role="img"
    >
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.9 11.8v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.4h-2.9v8.4A12 12 0 0 0 24 12Z"
      />
      <path
        fill="#fff"
        d="m16.7 15.4.5-3.4h-3.4V9.9c0-1 .5-1.9 2-1.9h1.5V5s-1.4-.2-2.7-.2c-2.7 0-4.5 1.6-4.5 4.6V12h-3v3.4h3v8.4a12 12 0 0 0 3.7 0v-8.4h2.9Z"
      />
    </svg>
  );
}

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

const previewHighlights: Record<AuthMode, string[]> = {
  login: [
    "Open the platform dashboard preview instantly.",
    "Explore exam workspace navigation and structure.",
    "Review the current premium UI system and interactions.",
  ],
  register: [
    "Preview a polished first-time account creation flow.",
    "Validate field hierarchy and form readability.",
    "Jump directly into the dashboard experience after submit.",
  ],
};

export function AuthPage({ mode }: AuthPageProps) {
  const content = authContent[mode];

  return (
    <div className="relative overflow-hidden">
      <div className="ph-animate-glow pointer-events-none absolute left-10 top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-16 h-72 w-72 rounded-full bg-secondary/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-accent/12 blur-3xl" />

      <SiteHeader current={mode} />

      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20 xl:px-8">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 lg:grid-cols-[1.15fr_0.85fr]">
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

            <div className="mt-8 rounded-[24px] border border-border/70 bg-bg/35 p-5 shadow-subtle">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                In this preview
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-7 text-text-secondary">
                {previewHighlights[mode].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-primary/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
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
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="ph-hover-lift inline-flex items-center justify-center gap-2 rounded-[16px] border border-border/80 bg-bg/45 px-4 py-3 text-sm font-semibold text-text-primary"
                  >
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="ph-hover-lift inline-flex items-center justify-center gap-2 rounded-[16px] border border-border/80 bg-bg/45 px-4 py-3 text-sm font-semibold text-text-primary"
                  >
                    <FacebookIcon />
                    Continue with Facebook
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="h-px w-full bg-border/70" />
                  <span className="absolute left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-bg px-3 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-text-secondary/70">
                    Or continue with email
                  </span>
                </div>
              </div>

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
