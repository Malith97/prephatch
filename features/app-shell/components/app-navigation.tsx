"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = {
  href: string;
  label: string;
  description: string;
};

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
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));
        const activeClass =
          theme === "dark"
            ? "border-white/20 bg-white text-slate-950 shadow-[0_18px_34px_rgba(15,23,42,0.22)]"
            : "border-sky-200 bg-sky-50 text-slate-950 shadow-[0_14px_28px_rgba(56,189,248,0.10)]";
        const inactiveClass =
          theme === "dark"
            ? "border-white/5 bg-white/[0.06] text-slate-300 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.09] hover:text-white active:translate-y-0"
            : "border-slate-200/80 bg-slate-50/90 text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-950 active:translate-y-0";
        const descriptionClass = isActive
          ? "text-slate-500"
          : theme === "dark"
            ? "text-slate-400"
            : "text-slate-500";

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`group rounded-[24px] border px-4 py-3.5 transition duration-200 ${
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
