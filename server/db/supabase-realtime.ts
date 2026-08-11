import type { RealtimeClientOptions } from "@supabase/realtime-js";
import WebSocket from "ws";

export const nodeRealtimeOptions = {
  transport: WebSocket as unknown as NonNullable<RealtimeClientOptions["transport"]>,
};
