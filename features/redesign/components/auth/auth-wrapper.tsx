import type { ReactNode } from "react";

export function AuthWrapper({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div className="phx-auth-panel">
        <p className="phx-kicker">PrepHatch</p>
        <h1 className="phx-heading-lg mt-3">{title}</h1>
        <p className="phx-body-md mt-2">{subtitle}</p>
      </div>
      <div className="phx-card">{children}</div>
    </section>
  );
}
