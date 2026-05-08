import Link from "next/link";

export function Footer() {
  return (
    <footer className="phx-footer">
      <div className="phx-container grid gap-4 py-8 sm:grid-cols-2 sm:items-center">
        <p className="phx-body-sm">© {new Date().getFullYear()} PrepHatch</p>
        <nav className="flex flex-wrap gap-4 sm:justify-end" aria-label="Footer links">
          <Link href="/faq" className="phx-footer-link">
            FAQ
          </Link>
          <Link href="/login" className="phx-footer-link">
            Login
          </Link>
          <Link href="/register" className="phx-footer-link">
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  );
}
