import { redirect } from "next/navigation";

type ExamResultsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamResultsRoute({
  params,
}: ExamResultsRouteProps) {
  redirect(`/exam/${params.examSlug}/results/latest-local`);
}
