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
      <div className="ph-animate-glow pointer-events-none absolute left-10 top-24 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

      <SiteHeader current={mode} />

      <main className="px-6 pb-16 pt-8 sm:pb-20">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[36px] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-10">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              {content.eyebrow}
            </div>
            <div className="mt-8 space-y-5">
              <h1 className="max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                {content.title}
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300">
                {content.description}
              </p>
            </div>

            <div className="mt-10 grid gap-4">
              {benefitPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-sky-200">
                      +
                    </span>
                    <p className="text-sm leading-7 text-slate-300">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.1)] backdrop-blur sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Preview mode
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-950">
                  {mode === "login" ? "Login" : "Register"}
                </h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                No backend required
              </div>
            </div>

            <form className="mt-8 space-y-5" aria-label={`${mode} preview form`}>
              {mode === "register" ? (
                <div className="space-y-2">
                  <label
                    htmlFor="displayName"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="displayName"
                    autoComplete="name"
                    type="text"
                    placeholder="Jane Learner"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={
                    mode === "login" ? "Enter your password" : "Create a password"
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.04)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              {mode === "register" ? (
                <label className="flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-200"
                  />
                  <span>
                    Send occasional launch updates and product notes while the
                    authentication backend is still being wired.
                  </span>
                </label>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="flex items-center gap-3 text-slate-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-200"
                    />
                    Remember this device
                  </label>
                  <span className="font-medium text-slate-400">
                    Auth hooks coming next
                  </span>
                </div>
              )}

              <Link
                href={content.submitHref}
                className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
              >
                {content.submitLabel}
              </Link>
            </form>

            <div className="mt-6 rounded-[24px] border border-sky-100 bg-sky-50 px-5 py-4 text-sm leading-7 text-sky-900">
              This page is intentionally static right now so the public-facing
              experience can be reviewed without any live auth or backend
              integration.
            </div>

            <p className="mt-6 text-sm text-slate-500">
              {content.alternatePrompt}{" "}
              <Link
                href={content.alternateHref}
                className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition duration-200 hover:decoration-slate-950"
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
