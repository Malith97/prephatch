import { redirect } from "next/navigation";

type ExamDetailRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamDetailRoute({ params }: ExamDetailRouteProps) {
  redirect(`/exam/${params.examSlug}`);
}
