import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} PrepHatch. All rights reserved.
          </p>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Privacy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
