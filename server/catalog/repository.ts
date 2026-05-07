import {
  listMockExamCatalog,
  type ExamCatalogItem,
} from "../../features/exams/mock-exam-catalog";
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

function toCatalogPackage(exam: ExamCatalogItem): CatalogPackage {
  return {
    ...exam,
    highlights: [...exam.highlights],
  };
}

function buildCatalogSnapshot(): CatalogPackage[] {
  return listMockExamCatalog().map(toCatalogPackage);
}

function isFresh<T>(entry: CacheEntry<T> | null, now: number): entry is CacheEntry<T> {
  return Boolean(entry && entry.expiresAt > now);
}

export function listCatalogPackages(): CatalogPackage[] {
  const now = Date.now();

  if (isFresh(listCache, now)) {
    return clone(listCache.value);
  }

  const snapshot = buildCatalogSnapshot();
  listCache = {
    value: snapshot,
    expiresAt: now + CACHE_TTL_MS,
  };

  return clone(snapshot);
}

export function getCatalogPackageBySlug(slug: string): CatalogPackage | null {
  const normalizedSlug = normalizePackageSlug(slug);
  const now = Date.now();
  const cachedDetail = detailCache.get(normalizedSlug);

  if (cachedDetail && cachedDetail.expiresAt > now) {
    return clone(cachedDetail.value);
  }

  const packageRecord =
    listCatalogPackages().find((catalogItem) => catalogItem.slug === normalizedSlug) ??
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
