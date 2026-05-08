import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "phx-btn-primary",
  secondary: "phx-btn-secondary",
  ghost: "phx-btn-ghost",
};

const sizeClassMap: Record<ButtonSize, string> = {
  sm: "phx-btn-sm",
  md: "phx-btn-md",
  lg: "phx-btn-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`phx-btn ${variantClassMap[variant]} ${sizeClassMap[size]} ${className}`.trim()}
      {...rest}
    >
      {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
}
