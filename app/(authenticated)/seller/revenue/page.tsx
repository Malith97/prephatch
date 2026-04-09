import type { Metadata } from "next";

import { RevenueIncomePage } from "../../../../features/seller-dashboard/components/revenue-income-page";

export const metadata: Metadata = {
  title: "Seller Revenue | PrepHatch",
  description: "Track seller revenue, payouts, and income projection.",
};

export default function SellerRevenueRoute() {
  return <RevenueIncomePage />;
}
