import type { Metadata } from "next";

import { AuthPage } from "../../features/auth/components/auth-page";

export const metadata: Metadata = {
  title: "Login | PrepHatch",
  description: "Preview the PrepHatch login experience.",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
