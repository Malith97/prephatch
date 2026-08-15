import { cn } from "@/lib/cn";

export type StepLabelSize = "sm" | "md";

export interface StepLabelProps {
  number: string;
  label: string;
  size?: StepLabelSize;
  className?: string;
}

/**
 * The "01 / Label" step marker used across numbered sections.
 * Replaces the duplicated inline <p> label pattern.
 */
export default function StepLabel({
  number,
  label,
  size = "sm",
  className,
}: StepLabelProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400",
        size === "md" && "text-sm",
        className,
      )}
    >
      {number} / {label}
    </p>
  );
}
