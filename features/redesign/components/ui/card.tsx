import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function Card({ title, description, action, children, className = "", ...rest }: CardProps) {
  return (
    <section className={`phx-card ${className}`.trim()} {...rest}>
      {(title || description || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="phx-card-title">{title}</h3> : null}
            {description ? <p className="phx-card-description">{description}</p> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
