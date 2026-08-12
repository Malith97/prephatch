import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            AI Resource Layer
          </Link>
          
          {/* Desktop navigation */}
          <ul className="hidden md:flex space-x-8 ml-auto">
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
                Solutions
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
                Resources
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Mobile menu button placeholder */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            aria-label="Open navigation menu"
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}
