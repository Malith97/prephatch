import { ExamCheatsheetsPage } from "../../../../../../features/exam-dashboard/components/exam-cheatsheets-page";

type ExamCheatsheetsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamCheatsheetsRoute({
  params,
}: ExamCheatsheetsRouteProps) {
  return <ExamCheatsheetsPage examSlug={params.examSlug} />;
}
