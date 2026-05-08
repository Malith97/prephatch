import { NextResponse } from "next/server";

import { getCatalogPackageBySlug } from "../../../../server/catalog/repository";
import type {
  CatalogApiErrorResponse,
  CatalogPackageDetailResponse,
} from "../../../../server/catalog/types";
import {
  isValidPackageSlug,
  normalizePackageSlug,
} from "../../../../server/catalog/validation";

export const revalidate = 60;

type PackageDetailRouteContext = {
  params: {
    slug: string;
  };
};

function badRequest(message: string) {
  const payload: CatalogApiErrorResponse = {
    error: {
      code: "invalid_package_slug",
      message,
    },
  };

  return NextResponse.json(payload, { status: 400 });
}

function notFound(message: string) {
  const payload: CatalogApiErrorResponse = {
    error: {
      code: "package_not_found",
      message,
    },
  };

  return NextResponse.json(payload, { status: 404 });
}

export function GET(_: Request, context: PackageDetailRouteContext) {
  const requestedAt = new Date().toISOString();
  const incomingSlug = context.params.slug ?? "";
  const normalizedSlug = normalizePackageSlug(incomingSlug);

  if (!isValidPackageSlug(normalizedSlug)) {
    console.info(
      `[catalog-api] ts=${requestedAt} method=GET path=/api/packages/${incomingSlug} result=invalid-slug`,
    );
    return badRequest(
      "package_slug must contain only lowercase letters, numbers, and hyphens.",
    );
  }

  const packageRecord = getCatalogPackageBySlug(normalizedSlug);
  if (!packageRecord) {
    console.info(
      `[catalog-api] ts=${requestedAt} method=GET path=/api/packages/${normalizedSlug} result=not-found`,
    );
    return notFound("Package was not found.");
  }

  console.info(
    `[catalog-api] ts=${requestedAt} method=GET path=/api/packages/${normalizedSlug} result=ok`,
  );

  const payload: CatalogPackageDetailResponse = {
    data: packageRecord,
    generatedAt: requestedAt,
  };

  return NextResponse.json(payload);
}
