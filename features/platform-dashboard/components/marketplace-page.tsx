import { SectionHeading } from "../../../components/section-heading";
import { getMarketplaceExamCards } from "../platform-dashboard-data";
import { MarketplaceExamCard } from "./marketplace-exam-card";

export function MarketplacePage() {
  const marketplaceExams = getMarketplaceExamCards();

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="Marketplace"
          title="Available certification packages you do not own yet."
          description="Preview the package structure, compare scope, and choose which exam to add next."
        />

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {marketplaceExams.map((exam) => (
            <MarketplaceExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>
    </main>
  );
}
