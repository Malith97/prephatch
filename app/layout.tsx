import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepHatch",
  description: "AI-assisted certification exam-readiness platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

