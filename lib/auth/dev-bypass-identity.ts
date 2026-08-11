export const SEEDED_DEV_BYPASS_USER_ID = "11111111-1111-4111-8111-111111111111";
export const SEEDED_DEV_BYPASS_ORGANIZATION_ID = "22222222-2222-4222-8222-222222222222";

export function resolveDevBypassUserId(): string {
  return (
    process.env.DEV_BYPASS_USER_ID?.trim() ||
    process.env.PREPHATCH_DEV_USER_ID?.trim() ||
    SEEDED_DEV_BYPASS_USER_ID
  );
}

export function resolveDevBypassOrganizationId(): string {
  return (
    process.env.DEV_BYPASS_ORGANIZATION_ID?.trim() ||
    process.env.PREPHATCH_DEV_ORGANIZATION_ID?.trim() ||
    SEEDED_DEV_BYPASS_ORGANIZATION_ID
  );
}
