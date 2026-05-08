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
  console.info(
    `[routing] legacy_redirect from=/exams/${params.examSlug}/results/${params.attemptId} to=/exam/${params.examSlug}/results/${params.attemptId}`,
  );
  redirect(`/exam/${params.examSlug}/results/${params.attemptId}`);
}
