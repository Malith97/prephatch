import type { Metadata } from "next";

import { MockExamBuilderPage } from "../../../../features/seller-dashboard/components/mock-exam-builder-page";

export const metadata: Metadata = {
  title: "Seller Mock Exams | PrepHatch",
  description: "Configure seller mock exams and timed exam sets.",
};

export default function SellerMockExamsRoute() {
  return <MockExamBuilderPage />;
}
