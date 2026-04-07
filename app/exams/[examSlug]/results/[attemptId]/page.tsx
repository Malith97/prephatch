import { redirect } from "next/navigation";

type AttemptResultsPageProps = {
  params: {
    examSlug: string;
    attemptId: string;
  };
};

export default function AttemptResultsPage({
  params,
}: AttemptResultsPageProps) {
  redirect(`/exam/${params.examSlug}/results/${params.attemptId}`);
}
