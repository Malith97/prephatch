"use client";

import { Alert, PublicShell } from "../../../features/redesign/components";

export default function MarketplaceDetailError() {
  return (
    <PublicShell>
      <Alert tone="warning" title="Unable to load package" message="Please refresh and try again." />
    </PublicShell>
  );
}
