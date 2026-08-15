import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Project", href: "/solutions" },
  { label: "About", href: "/about" },
  { label: "Notes", href: "/resources" },
  { label: "Careers", href: "/resources/careers" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 sm:py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                P
              </span>
              <span>PrepHatch</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-gray-600 dark:text-gray-400">
              Research and practical tools for clearer AI-supported work across
              Australia and Europe.
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-500">
              Australia / Berlin, Germany
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
              Site
            </p>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-500">
              Legal
            </p>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 py-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} PrepHatch.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Independent research and engineering.
          </p>
        </div>
      </div>
    </footer>
  );
}
