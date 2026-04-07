import type { Metadata } from "next";

import { AuthPage } from "../../features/auth/components/auth-page";

export const metadata: Metadata = {
  title: "Register | PrepHatch",
  description: "Preview the PrepHatch registration experience.",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
