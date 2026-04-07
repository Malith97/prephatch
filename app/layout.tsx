import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrepHatch",
  description: "Modern certification exam-readiness for focused learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg font-sans text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
