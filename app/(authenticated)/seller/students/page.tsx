import type { Metadata } from "next";

import { StudentsPage } from "../../../../features/seller-dashboard/components/students-page";

export const metadata: Metadata = {
  title: "Seller Students | PrepHatch",
  description: "View and manage enrolled students.",
};

export default function SellerStudentsRoute() {
  return <StudentsPage />;
}
