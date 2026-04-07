import type { Metadata } from "next";

import { DashboardPage } from "../../../features/dashboard/components/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | PrepHatch",
  description: "PrepHatch learner dashboard preview.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
