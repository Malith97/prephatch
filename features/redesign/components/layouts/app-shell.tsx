import type { ReactNode } from "react";
import type { NavItem } from "../../types";
import { Sidebar } from "../navigation/sidebar";

export function AppShell({
  title,
  navItems,
  actions,
  children,
}: {
  title: string;
  navItems: NavItem[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="phx-page-bg min-h-screen">
      <header className="phx-app-header">
        <div className="phx-container flex items-center justify-between gap-4 py-4">
          <h1 className="phx-heading-lg">{title}</h1>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </div>
      </header>

      <div className="phx-container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Sidebar items={navItems} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
