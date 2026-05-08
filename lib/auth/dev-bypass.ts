const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);

export type DevBypassState = {
  enabled: boolean;
  nodeEnv: string;
};

function parseBooleanFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return TRUTHY_VALUES.has(value.trim().toLowerCase());
}

function isProductionEnvironment(env: Record<string, string | undefined>): boolean {
  return env.NODE_ENV === "production" || env.VERCEL_ENV === "production";
}

export function resolveDevBypassState(
  env: Record<string, string | undefined> = process.env,
): DevBypassState {
  const enabledByFlag = parseBooleanFlag(env.ALLOW_DEV_BYPASS);
  const nodeEnv = env.NODE_ENV ?? "development";

  if (enabledByFlag && isProductionEnvironment(env)) {
    throw new Error(
      "ALLOW_DEV_BYPASS cannot be enabled in production environments.",
    );
  }

  return {
    enabled: enabledByFlag,
    nodeEnv,
  };
}
