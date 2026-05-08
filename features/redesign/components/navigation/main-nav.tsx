import Link from "next/link";
import type { NavItem } from "../../types";

const defaultLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/exams", label: "Exams" },
  { href: "/(authenticated)/dashboard/marketplace", label: "Marketplace" },
  { href: "/faq", label: "FAQ" },
];

export function MainNav({ links = defaultLinks }: { links?: NavItem[] }) {
  return (
    <nav className="phx-top-nav" aria-label="Primary navigation">
      <Link href="/" className="phx-brand" aria-label="PrepHatch home">
        PrepHatch
      </Link>
      <ul className="phx-nav-list">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="phx-nav-link">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
