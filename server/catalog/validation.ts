const PACKAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PACKAGE_SLUG_LENGTH = 120;

export function isValidPackageSlug(value: string): boolean {
  if (!value || value.length > MAX_PACKAGE_SLUG_LENGTH) {
    return false;
  }

  return PACKAGE_SLUG_PATTERN.test(value);
}

export function normalizePackageSlug(value: string): string {
  return value.trim().toLowerCase();
}
