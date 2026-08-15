import Link from "next/link";
import Button from "@/components/ui/Button";
import MobileNav from "@/components/sections/MobileNav";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-[var(--background)]/80 backdrop-blur-md dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              P
            </span>
            <span>PrepHatch</span>
          </Link>

          <ul className="hidden md:flex ml-auto items-center gap-6 lg:gap-8">
            <li>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/solutions"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Project
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/resources"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Notes
              </Link>
            </li>
          </ul>

          <div className="hidden md:block">
            <Button href="/contact" size="md">
              Contact us
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </nav>
  );
}
