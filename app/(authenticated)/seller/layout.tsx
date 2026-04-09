import type { ReactNode } from "react";

import { SellerShell } from "../../../features/app-shell/components/seller-shell";
import { SellerStudioProvider } from "../../../features/seller-dashboard/context/seller-studio-provider";
import { getSellerStudioSeed } from "../../../server/seller/repository";

export default function SellerLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const initialData = getSellerStudioSeed();

  return (
    <SellerStudioProvider initialData={initialData}>
      <SellerShell>{children}</SellerShell>
    </SellerStudioProvider>
  );
}
