import Link from "next/link";

import { BrandMark } from "../../../components/brand-mark";

type SiteHeaderProps = {
  current?: "home" | "login" | "register";
};

const homeLinks = [
  { href: "#value", label: "Value" },
  { href: "#differentiators", label: "Why it stands out" },
  { href: "#categories", label: "Coverage" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader({ current = "home" }: SiteHeaderProps) {
  const isHome = current === "home";

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 sm:px-6 sm:pt-5">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/70 bg-white/75 px-4 py-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
        <BrandMark />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex"
        >
          {isHome ? (
            homeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 transition duration-200 hover:bg-white/80 hover:text-slate-950"
              >
                {link.label}
              </a>
            ))
          ) : (
            <>
              <Link
                href="/"
                className="rounded-full px-3 py-2 transition duration-200 hover:bg-white/80 hover:text-slate-950"
              >
                Home
              </Link>
              <Link
                href="/exams"
                className="rounded-full px-3 py-2 transition duration-200 hover:bg-white/80 hover:text-slate-950"
              >
                Preview mock
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {current !== "login" ? (
            <Link
              href="/login"
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 active:translate-y-0"
            >
              Login
            </Link>
          ) : null}
          {current !== "register" ? (
            <Link
              href="/register"
              className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(15,23,42,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0"
            >
              Register
            </Link>
          ) : null}
        </div>
      </header>
    </div>
  );
}
