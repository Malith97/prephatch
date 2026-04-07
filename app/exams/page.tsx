import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Browse Exams | PrepHatch",
  description: "Browse certification packages and view exam details in PrepHatch.",
};

export default function ExamsRoute() {
  redirect("/dashboard/marketplace");
}
