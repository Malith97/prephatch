"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Project" },
  { href: "/about", label: "About" },
  { href: "/resources", label: "Notes" },
  { href: "/contact", label: "Contact" },
];

/**
 * Client-side mobile navigation: toggled disclosure panel with a working
 * open/close button (the previous nav rendered a non-functional ☰ icon).
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <span className="relative flex h-4 w-4 flex-col items-center justify-center">
          <span
            className={cn(
              "absolute h-px w-4 bg-current transition-transform duration-200",
              open ? "rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            className={cn(
              "absolute h-px w-4 bg-current transition-opacity duration-200",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "absolute h-px w-4 bg-current transition-transform duration-200",
              open ? "-rotate-45" : "translate-y-1.5",
            )}
          />
        </span>
      </button>

      <div
        id="mobile-nav-panel"
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-gray-200 bg-[var(--surface)] shadow-[var(--shadow-lift)] transition-all duration-200 dark:border-gray-800",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <ul className="mx-auto max-w-screen-xl divide-y divide-gray-200 px-4 dark:divide-gray-800">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-base font-medium text-gray-800 dark:text-gray-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
