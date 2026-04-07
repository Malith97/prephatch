import type { ReactNode } from "react";

import { AuthenticatedShell } from "../../features/app-shell/components/authenticated-shell";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
