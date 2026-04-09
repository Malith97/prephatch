import type { ReactNode } from "react";

type SellerPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function SellerPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: Readonly<SellerPageHeaderProps>) {
  return (
    <section className="ph-surface rounded-[32px] p-6 sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-4xl space-y-3">
          <p className="ph-eyebrow">{eyebrow}</p>
          <h1 className="ph-display-title text-3xl sm:text-4xl">{title}</h1>
          <p className="ph-body-sm">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  note?: string;
  tone?: "default" | "success" | "accent" | "warning";
};

export function MetricCard({
  label,
  value,
  note,
  tone = "default",
}: Readonly<MetricCardProps>) {
  const toneClass =
    tone === "success"
      ? "border-success/20"
      : tone === "accent"
        ? "border-accent/20"
        : tone === "warning"
          ? "border-warning/20"
          : "border-border/70";

  return (
    <article className={`rounded-[24px] border ${toneClass} bg-bg/35 p-5 shadow-subtle`}>
      <p className="text-xs uppercase tracking-[0.18em] text-text-secondary/70">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-text-primary">{value}</p>
      {note ? <p className="mt-3 text-sm leading-6 text-text-secondary">{note}</p> : null}
    </article>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  action,
}: Readonly<EmptyStateProps>) {
  return (
    <div className="rounded-[26px] border border-dashed border-border/70 bg-bg/25 p-8 text-center">
      <p className="text-lg font-semibold text-text-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-text-secondary">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

type MiniTrendProps = {
  points: number[];
};

export function MiniTrend({ points }: Readonly<MiniTrendProps>) {
  if (points.length === 0) {
    return <p className="text-sm text-text-secondary">No trend data yet.</p>;
  }

  const max = Math.max(...points, 1);

  return (
    <div className="flex h-16 items-end gap-1.5">
      {points.map((point, index) => (
        <span
          key={`${index}-${point}`}
          className="w-full rounded-t bg-primary/70"
          style={{ height: `${Math.max(10, (point / max) * 100)}%` }}
          title={`${point.toFixed(1)}`}
        />
      ))}
    </div>
  );
}
