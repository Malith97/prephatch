import type { Metadata } from "next";

import { ResultsPerformancePage } from "../../../../features/seller-dashboard/components/results-performance-page";

export const metadata: Metadata = {
  title: "Seller Results | PrepHatch",
  description: "Track mock results and student performance.",
};

export default function SellerResultsRoute() {
  return <ResultsPerformancePage />;
}
