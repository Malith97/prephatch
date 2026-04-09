import type { Metadata } from "next";

import { SellerAnalyticsPage } from "../../../../features/seller-dashboard/components/seller-analytics-page";

export const metadata: Metadata = {
  title: "Seller Analytics | PrepHatch",
  description: "Instructor analytics for enrollments, completion, and scores.",
};

export default function SellerAnalyticsRoute() {
  return <SellerAnalyticsPage />;
}
