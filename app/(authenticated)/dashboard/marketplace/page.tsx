import type { Metadata } from "next";

import { MarketplacePage } from "../../../../features/platform-dashboard/components/marketplace-page";

export const metadata: Metadata = {
  title: "Marketplace | PrepHatch",
  description: "Preview available certification packages in PrepHatch.",
};

export default function MarketplaceRoute() {
  return <MarketplacePage />;
}
