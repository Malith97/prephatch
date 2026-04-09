import type { Metadata } from "next";

import { QuestionBankPage } from "../../../../features/seller-dashboard/components/question-bank-page";

export const metadata: Metadata = {
  title: "Seller Question Bank | PrepHatch",
  description: "Manage question bank, correctness rules, and CSV imports.",
};

export default function SellerQuestionsRoute() {
  return <QuestionBankPage />;
}
