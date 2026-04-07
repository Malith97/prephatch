import type { Metadata } from "next";

import { PlatformDashboardPage } from "../../../features/platform-dashboard/components/platform-dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | PrepHatch",
  description: "PrepHatch platform dashboard.",
};

export default function DashboardRoute() {
  return <PlatformDashboardPage />;
}
