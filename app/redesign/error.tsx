"use client";

import { Alert } from "../../features/redesign/components";

export default function RedesignError() {
  return (
    <div className="phx-page-bg min-h-screen p-6">
      <Alert tone="warning" title="Something went wrong" message="Unable to render redesign preview." />
    </div>
  );
}
