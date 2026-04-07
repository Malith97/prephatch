import type { Metadata } from "next";

import { PackagePreviewPage } from "../../../../../features/platform-dashboard/components/package-preview-page";

type PackagePreviewRouteProps = {
  params: {
    packageSlug: string;
  };
};

export async function generateMetadata({
  params,
}: PackagePreviewRouteProps): Promise<Metadata> {
  return {
    title: `Package Preview | ${params.packageSlug} | PrepHatch`,
    description: "Purchase-facing certification package preview in PrepHatch.",
  };
}

export default function PackagePreviewRoute({
  params,
}: PackagePreviewRouteProps) {
  return <PackagePreviewPage packageSlug={params.packageSlug} />;
}
