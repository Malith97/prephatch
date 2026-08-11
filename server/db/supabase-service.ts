import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getRequiredEnvVar } from "./supabase-env";
import { nodeRealtimeOptions } from "./supabase-realtime";

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient {
  if (serviceClient) {
    return serviceClient;
  }

  serviceClient = createClient(
    getRequiredEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
    getRequiredEnvVar("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: nodeRealtimeOptions,
    },
  );

  return serviceClient;
}
