import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicKey } from "../../server/db/supabase-env";

function getSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL. Please define it in .env.local.",
    );
  }

  return value;
}

export const createClient = () => createBrowserClient(getSupabaseUrl(), getSupabasePublicKey());
