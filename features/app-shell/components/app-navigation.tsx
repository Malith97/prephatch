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
        const prefixMatches = [item.href, ...(item.activePrefixes ?? [])].some(
          (prefix) => pathname === prefix || (prefix !== "/" && pathname.startsWith(`${prefix}/`)),
        );
        const isActive = item.exact ? pathname === item.href : prefixMatches;

        const activeClass =
          theme === "dark"
            ? "border-primary/40 bg-gradient-to-br from-primary/22 via-secondary/12 to-primary/12 text-text-primary shadow-glow"
            : "border-primary/35 bg-primary/14 text-text-primary shadow-subtle";

        const inactiveClass =
          theme === "dark"
            ? "border-border/70 bg-bg/35 text-text-secondary hover:-translate-y-0.5 hover:border-primary/25 hover:bg-bg/55 hover:text-text-primary active:translate-y-0"
            : "border-border/70 bg-surface/55 text-text-secondary hover:-translate-y-0.5 hover:border-primary/25 hover:bg-surface-elevated/78 hover:text-text-primary active:translate-y-0";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group rounded-xl border px-4 py-4 transition duration-200 ease-premium ${
              isActive ? activeClass : inactiveClass
            } ${compact ? "min-w-[210px]" : ""}`}
          >
            <div className="text-sm font-semibold">{item.label}</div>
            <div className={`mt-1 text-xs leading-5 ${isActive ? "text-text-secondary/88" : "text-text-secondary/72"}`}>
              {item.description}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
