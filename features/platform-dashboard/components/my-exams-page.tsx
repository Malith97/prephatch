import { SectionHeading } from "../../../components/section-heading";
import { getPurchasedExamCards } from "../platform-dashboard-data";
import { PurchasedExamCard } from "./purchased-exam-card";

export function MyExamsPage() {
  const purchasedExams = getPurchasedExamCards();

  return (
    <main className="space-y-5">
      <section className="ph-surface rounded-[36px] p-6 sm:p-8">
        <SectionHeading
          eyebrow="My exams"
          title="Your owned certification workspaces."
          description="This route stays focused on resume behavior and owned access only."
        />

        <div className="mt-6 grid gap-4">
          {purchasedExams.map((exam) => (
            <PurchasedExamCard key={exam.slug} exam={exam} />
          ))}
        </div>
      </section>
    </main>
  );
}
