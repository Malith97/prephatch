import { redirect } from "next/navigation";

type ExamDetailRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamDetailRoute({ params }: ExamDetailRouteProps) {
  console.info(
    `[routing] legacy_redirect from=/exams/${params.examSlug} to=/exam/${params.examSlug}`,
  );
  redirect(`/exam/${params.examSlug}`);
}
