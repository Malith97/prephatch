import { redirect } from "next/navigation";

type ResultsPageProps = {
  params: {
    examSlug: string;
  };
};

export default function ResultsPage({ params }: ResultsPageProps) {
  console.info(
    `[routing] legacy_redirect from=/exams/${params.examSlug}/results to=/exam/${params.examSlug}/results`,
  );
  redirect(`/exam/${params.examSlug}/results`);
}
