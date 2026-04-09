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
      <header className="ph-surface mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-6 xl:px-8">
        <BrandMark />

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-2 md:flex"
        >
          {isHome ? (
            homeLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="ph-btn ph-btn-sm px-3 text-text-secondary hover:bg-surface-elevated/75 hover:text-text-primary"
              >
                {link.label}
              </a>
            ))
          ) : (
            <>
              <Link
                href="/"
                className="ph-btn ph-btn-sm px-3 text-text-secondary hover:bg-surface-elevated/75 hover:text-text-primary"
              >
                Home
              </Link>
              <Link
                href="/exams"
                className="ph-btn ph-btn-sm px-3 text-text-secondary hover:bg-surface-elevated/75 hover:text-text-primary"
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
              className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift"
            >
              Login
            </Link>
          ) : null}
          {current !== "register" ? (
            <Link
              href="/register"
              className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift"
            >
              Register
            </Link>
          ) : null}
        </div>
      </header>
    </div>
  );
}
