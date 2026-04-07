import { ExamSettingsPage } from "../../../../../../features/exam-dashboard/components/exam-settings-page";

type ExamSettingsRouteProps = {
  params: {
    examSlug: string;
  };
};

export default function ExamSettingsRoute({
  params,
}: ExamSettingsRouteProps) {
  return <ExamSettingsPage examSlug={params.examSlug} />;
}
