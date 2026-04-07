import { ExamNotesPage } from "../../../../../../features/exam-dashboard/components/exam-notes-page";

type ExamNotesRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamNotesRoute({ params }: ExamNotesRouteProps) {
  return <ExamNotesPage examSlug={params.examSlug} />;
}
