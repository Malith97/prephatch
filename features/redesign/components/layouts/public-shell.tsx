import type { ReactNode } from "react";
import { MainNav } from "../navigation/main-nav";
import { Footer } from "../public/footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="phx-page-bg min-h-screen">
      <MainNav />
      <main className="phx-container py-8 sm:py-12">{children}</main>
      <Footer />
    </div>
  );
}
