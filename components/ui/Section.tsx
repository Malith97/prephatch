import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SectionProps {
  label?: string;
  number?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  divider?: boolean;
  tight?: boolean;
}

/**
 * Shared section shell: full-width container with consistent horizontal
 * padding and optional top/bottom borders. Replaces the duplicated
 * `max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-b`
 * boilerplate across every section component.
 */
export default function Section({
  label,
  number,
  children,
  className,
  innerClassName,
  divider = true,
  tight = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "w-full",
        divider && "border-b border-gray-200 dark:border-gray-800",
        tight ? "py-12 sm:py-16" : "py-16 sm:py-24",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8",
          innerClassName,
        )}
      >
        {(label || number) && (
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {number ? `${number} / ${label}` : label}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
