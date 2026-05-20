import { getAttemptsRepository } from "../exams/db-repository";
import type { RuntimeExam } from "../exams/db-repository";
import type { CatalogPackage } from "./types";
import { normalizePackageSlug } from "./validation";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const CACHE_TTL_MS = 60_000;
let listCache: CacheEntry<CatalogPackage[]> | null = null;
const detailCache = new Map<string, CacheEntry<CatalogPackage | null>>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function providerFromCertification(code: string): string {
  if (code.toUpperCase().startsWith("AWS")) {
    return "AWS";
  }
  if (code.toUpperCase().startsWith("AZ")) {
    return "Azure";
  }
  return "Certification";
}

function certificationCodeFromExam(exam: RuntimeExam): string {
  const parts = exam.slug.split("-");
  if (parts[0] === "aws") {
    return parts.slice(1).join("-").toUpperCase();
  }
  return exam.certificationCode.toUpperCase();
}

function toCatalogPackage(exam: RuntimeExam): CatalogPackage {
  const certificationCode = certificationCodeFromExam(exam);
  const provider = providerFromCertification(exam.slug.toUpperCase());
  const isLive = exam.questions.length > 0;

  return {
    id: exam.id,
    slug: exam.slug,
    provider,
    category: "Certification prep",
    certificationCode,
    title: exam.title,
    description: exam.description,
    priceLabel: exam.packageTier === "free" ? "Free preview" : "Premium access",
    ownershipLabel: exam.packageTier === "free" ? "Free" : "Entitlement required",
    ownershipTone: exam.packageTier === "free" ? "active" : "neutral",
    progressLabel: isLive ? "Live mock available" : "Coming soon",
    progressDetail: isLive
      ? "Start the server-backed free mock and resume progress across reloads."
      : "Content is not published yet.",
    availability: isLive ? "live" : "planned",
    detailSummary: exam.description,
    mockCountLabel: `${exam.questions.length} question${exam.questions.length === 1 ? "" : "s"}`,
    formatLabel: `${exam.durationMinutes} minute timed mock`,
    detailCtaHref: `/exams/${exam.slug}`,
    primaryActionLabel: isLive ? "Start free mock" : "View details",
    primaryActionHref: isLive
      ? `/exams/${exam.slug}/mock/${exam.examVersionId}`
      : `/exams/${exam.slug}`,
    secondaryActionLabel: "Review latest results",
    secondaryActionHref: `/exams/${exam.slug}/results/latest-local`,
    highlights: [
      "Server-backed attempts with immutable question snapshots",
      "Autosave and resume are stored in the local database",
      "Results and explanations unlock only after submit",
    ],
  };
}

function isFresh<T>(entry: CacheEntry<T> | null, now: number): entry is CacheEntry<T> {
  return Boolean(entry && entry.expiresAt > now);
}

export async function listCatalogPackages(): Promise<CatalogPackage[]> {
  const now = Date.now();

  if (isFresh(listCache, now)) {
    return clone(listCache.value);
  }

  const snapshot = (await getAttemptsRepository().listCatalogPackages()).map(toCatalogPackage);
  listCache = {
    value: snapshot,
    expiresAt: now + CACHE_TTL_MS,
  };

  return clone(snapshot);
}

export async function getCatalogPackageBySlug(slug: string): Promise<CatalogPackage | null> {
  const normalizedSlug = normalizePackageSlug(slug);
  const now = Date.now();
  const cachedDetail = detailCache.get(normalizedSlug);

  if (cachedDetail && cachedDetail.expiresAt > now) {
    return clone(cachedDetail.value);
  }

  const packageRecord =
    (await listCatalogPackages()).find((catalogItem) => catalogItem.slug === normalizedSlug) ??
    null;

  detailCache.set(normalizedSlug, {
    value: packageRecord,
    expiresAt: now + CACHE_TTL_MS,
  });

  return clone(packageRecord);
}

export function clearCatalogRepositoryCache(): void {
  listCache = null;
  detailCache.clear();
}
