import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import {
  canAccessInstructorViews,
  getAppSessionUser,
} from "../../../lib/auth/app-session";
import { SellerShell } from "../../../features/app-shell/components/seller-shell";
import { SellerStudioProvider } from "../../../features/seller-dashboard/context/seller-studio-provider";
import { getSellerStudioSeed } from "../../../server/seller/repository";

export default async function SellerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const sessionUser = await getAppSessionUser();

  if (!sessionUser) {
    redirect("/login");
  }

  // Role gate: seller/admin views are restricted to instructor-grade roles.
  if (!canAccessInstructorViews(sessionUser.role)) {
    redirect("/dashboard");
  }

  const initialData = getSellerStudioSeed();

  return (
    <SellerStudioProvider initialData={initialData}>
      <SellerShell sessionUser={sessionUser}>{children}</SellerShell>
    </SellerStudioProvider>
  );
}
