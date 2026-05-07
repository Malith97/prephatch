import { NextResponse } from "next/server";

import { listCatalogPackages } from "../../../server/catalog/repository";
import type { CatalogPackagesListResponse } from "../../../server/catalog/types";

export const revalidate = 60;

export function GET() {
  const requestedAt = new Date().toISOString();
  const packages = listCatalogPackages();

  console.info(
    `[catalog-api] ts=${requestedAt} method=GET path=/api/packages result=ok count=${packages.length}`,
  );

  const payload: CatalogPackagesListResponse = {
    data: packages,
    generatedAt: requestedAt,
  };

  return NextResponse.json(payload);
}
