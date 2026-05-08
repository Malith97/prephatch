import type { ReactNode } from "react";

type AlertTone = "info" | "success" | "warning";

type AlertProps = {
  tone?: AlertTone;
  title: string;
  message: ReactNode;
};

const toneClassMap: Record<AlertTone, string> = {
  info: "phx-alert-info",
  success: "phx-alert-success",
  warning: "phx-alert-warning",
};

export function Alert({ tone = "info", title, message }: AlertProps) {
  return (
    <div className={`phx-alert ${toneClassMap[tone]}`.trim()} role="alert" aria-live="polite">
      <strong className="phx-heading-sm">{title}</strong>
      <p className="phx-body-sm mt-1">{message}</p>
    </div>
  );
}
