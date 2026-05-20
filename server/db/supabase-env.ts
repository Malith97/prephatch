type PublicSupabaseKeyName =
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export function getRequiredEnvVar(name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY"): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please define it in .env.local.`,
    );
  }

  return value;
}

export function getSupabasePublicKey(): string {
  const preferredName: PublicSupabaseKeyName = "NEXT_PUBLIC_SUPABASE_ANON_KEY";
  const legacyName: PublicSupabaseKeyName = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
  const preferredValue = process.env[preferredName]?.trim();
  const legacyValue = process.env[legacyName]?.trim();

  if (preferredValue) {
    return preferredValue;
  }

  if (legacyValue) {
    return legacyValue;
  }

  throw new Error(
    `Missing required environment variable: ${preferredName}. ` +
      `Define ${preferredName} in .env.local. ${legacyName} is accepted as a legacy fallback only.`,
  );
}
