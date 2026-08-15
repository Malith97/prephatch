import { cn } from "@/lib/cn";

export type StatusVariant = "development" | "draft" | "note";

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantClasses: Record<StatusVariant, string> = {
  development:
    "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  draft:
    "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  note:
    "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

/**
 * Status badge with accent-colored variants.
 * Uses the brand accent for "In Development", amber for drafts, neutral for notes.
 */
export default function StatusBadge({
  status,
  variant = "note",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
    >
      {status}
    </span>
  );
}
