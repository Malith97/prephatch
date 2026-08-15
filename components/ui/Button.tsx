import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-[var(--shadow-soft)] hover:bg-blue-700 hover:shadow-[var(--shadow-lift)]",
  secondary:
    "border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800",
  ghost:
    "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

/**
 * Shared CTA button. Renders a Next.js Link for internal hrefs and a plain
 * anchor for external/mailto links so both keep consistent styling.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  external = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
