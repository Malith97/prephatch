import { Spinner } from "../../features/redesign/components";

export default function LoadingRedesignPage() {
  return (
    <div className="phx-page-bg flex min-h-screen items-center justify-center">
      <Spinner label="Loading redesign preview" />
    </div>
  );
}
