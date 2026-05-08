export type CatalogAvailability = "live" | "planned";

export type CatalogOwnershipTone = "owned" | "active" | "neutral" | "comingSoon";

export type CatalogPackage = {
  id: string;
  slug: string;
  provider: string;
  category: string;
  certificationCode: string;
  title: string;
  description: string;
  priceLabel: string;
  ownershipLabel: string;
  ownershipTone: CatalogOwnershipTone;
  progressLabel: string;
  progressDetail: string;
  availability: CatalogAvailability;
  detailSummary: string;
  mockCountLabel: string;
  formatLabel: string;
  detailCtaHref: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  highlights: string[];
};

export type CatalogPackagesListResponse = {
  data: CatalogPackage[];
  generatedAt: string;
};

export type CatalogPackageDetailResponse = {
  data: CatalogPackage;
  generatedAt: string;
};

export type CatalogApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};
