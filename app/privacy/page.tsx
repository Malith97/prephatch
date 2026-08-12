import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy — content coming soon.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight mb-6">
              Privacy
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Content coming soon.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
