import type { Metadata } from "next";

import { BrowseExamsPage } from "../../features/exams/components/browse-exams-page";

export const metadata: Metadata = {
  title: "Browse Exams | PrepHatch",
  description: "Browse certification packages and view exam details in PrepHatch.",
};

export default function ExamsRoute() {
  return <BrowseExamsPage />;
}
