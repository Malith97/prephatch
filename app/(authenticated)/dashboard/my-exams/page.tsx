import type { Metadata } from "next";

import { MyExamsPage } from "../../../../features/platform-dashboard/components/my-exams-page";

export const metadata: Metadata = {
  title: "My Exams | PrepHatch",
  description: "Owned certification workspaces in PrepHatch.",
};

export default function MyExamsRoute() {
  return <MyExamsPage />;
}
