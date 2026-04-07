import type { ReactNode } from "react";

import { PlatformShell } from "../../../features/app-shell/components/platform-shell";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <PlatformShell>{children}</PlatformShell>;
}
