"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  href: string;
  label: string;
  description: string;
  exact?: boolean;
  activePrefixes?: string[];
};

export type { NavigationItem };

type AppNavigationProps = {
  items: NavigationItem[];
  compact?: boolean;
  theme?: "light" | "dark";
};

export function AppNavigation({
  items,
  compact = false,
  theme = "dark",
}: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App navigation"
      className={
        compact
          ? "flex gap-2 overflow-x-auto pb-1 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-2.5"
      }
    >
      {items.map((item) => {
        const prefixMatches = [
          item.href,
          ...(item.activePrefixes ?? []),
        ].some(
          (prefix) =>
            pathname === prefix ||
            (prefix !== "/" && pathname.startsWith(`${prefix}/`)),
        );
        const isActive = item.exact ? pathname === item.href : prefixMatches;
        const activeClass =
          theme === "dark"
            ? "border-primary/25 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(227,234,255,0.84))] text-slate-950 shadow-glow"
            : "border-primary/25 bg-primary/12 text-text-primary shadow-subtle";
        const inactiveClass =
          theme === "dark"
            ? "border-border/65 bg-white/[0.04] text-text-secondary hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/[0.08] hover:text-text-primary active:translate-y-0"
            : "border-border/70 bg-surface/55 text-text-secondary hover:-translate-y-0.5 hover:border-primary/20 hover:bg-surface-elevated/78 hover:text-text-primary active:translate-y-0";
        const descriptionClass = isActive
          ? theme === "dark"
            ? "text-slate-500"
            : "text-text-secondary/80"
          : theme === "dark"
            ? "text-slate-500"
            : "text-text-secondary/70";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group rounded-[26px] border px-4 py-4 transition duration-200 ease-premium ${
              isActive ? activeClass : inactiveClass
            } ${compact ? "min-w-[200px]" : ""}`}
          >
            <div className="text-sm font-semibold">{item.label}</div>
            <div className={`mt-1 text-xs leading-5 ${descriptionClass}`}>
              {item.description}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
