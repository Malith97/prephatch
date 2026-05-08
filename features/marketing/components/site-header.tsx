import Link from "next/link";

import { BrandMark } from "../../../components/brand-mark";

type SiteHeaderProps = {
  current?: "home" | "login" | "register";
};

const homeLinks = [
  { href: "#value-props", label: "Product" },
  { href: "#how-it-works", label: "Workflow" },
  { href: "#outcomes", label: "Outcomes" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader({ current = "home" }: SiteHeaderProps) {
  const isHome = current === "home";

  return (
    <div className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <header className="ph-surface mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:px-6 xl:px-8">
        <BrandMark />

        <nav aria-label="Primary navigation" className="hidden items-center gap-2 lg:flex">
          {isHome
            ? homeLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="ph-btn ph-btn-sm border border-transparent bg-transparent px-3 text-text-secondary hover:border-border/75 hover:bg-bg/45 hover:text-text-primary"
                >
                  {link.label}
                </a>
              ))
            : (
                <>
                  <Link
                    href="/"
                    className="ph-btn ph-btn-sm border border-transparent bg-transparent px-3 text-text-secondary hover:border-border/75 hover:bg-bg/45 hover:text-text-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/exams"
                    className="ph-btn ph-btn-sm border border-transparent bg-transparent px-3 text-text-secondary hover:border-border/75 hover:bg-bg/45 hover:text-text-primary"
                  >
                    Browse exams
                  </Link>
                </>
              )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {current !== "login" ? (
            <Link href="/login" className="ph-btn ph-btn-sm ph-button-secondary ph-hover-lift">
              Login
            </Link>
          ) : null}
          {current !== "register" ? (
            <Link href="/register" className="ph-btn ph-btn-sm ph-button-primary ph-hover-lift">
              Start free
            </Link>
          ) : null}
        </div>
      </header>
    </div>
  );
}
