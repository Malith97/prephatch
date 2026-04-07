import { redirect } from "next/navigation";

type ResultsPageProps = {
  params: {
    examSlug: string;
  };
};

export default function ResultsPage({ params }: ResultsPageProps) {
  redirect(`/exam/${params.examSlug}/results`);
}
