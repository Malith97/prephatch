import Link from "next/link";
import type { NavItem } from "../../types";

export function Sidebar({ title = "Workspace", items }: { title?: string; items: NavItem[] }) {
  return (
    <aside className="phx-sidebar" aria-label={`${title} navigation`}>
      <h2 className="phx-heading-sm px-3">{title}</h2>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="phx-sidebar-link">
              <span>{item.label}</span>
              {item.badge ? <span className="phx-chip">{item.badge}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
