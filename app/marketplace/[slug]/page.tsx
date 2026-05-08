import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PackageDetail, PublicShell } from "../../../features/redesign/components";
import { getMarketplacePackages } from "../../../features/redesign/lib/mock-data";

export const metadata: Metadata = {
  title: "Marketplace Package | PrepHatch",
  description: "Explore package details before starting your next exam prep path.",
};

export default async function MarketplacePackagePage({ params }: { params: { slug: string } }) {
  const packages = await getMarketplacePackages();
  const current = packages.find((item) => item.slug === params.slug);

  if (!current) {
    notFound();
  }

  return (
    <PublicShell>
      <PackageDetail packagePromise={Promise.resolve(current)} />
    </PublicShell>
  );
}
