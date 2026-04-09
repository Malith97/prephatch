import type { Metadata } from "next";

import { CourseManagementPage } from "../../../../features/seller-dashboard/components/course-management-page";

export const metadata: Metadata = {
  title: "Seller Courses | PrepHatch",
  description: "Manage seller courses, status, and pricing.",
};

export default function SellerCoursesRoute() {
  return <CourseManagementPage />;
}
