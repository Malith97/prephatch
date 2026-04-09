import type { Metadata } from "next";

import { SellerDashboardHomePage } from "../../../features/seller-dashboard/components/seller-dashboard-home-page";

export const metadata: Metadata = {
  title: "Seller Overview | PrepHatch",
  description: "Instructor operations dashboard for PrepHatch.",
};

export default function SellerOverviewRoute() {
  return <SellerDashboardHomePage />;
}
