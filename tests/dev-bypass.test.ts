import { describe, expect, it } from "vitest";

import { resolveDevBypassState } from "../lib/auth/dev-bypass";

describe("resolveDevBypassState", () => {
  it("enables bypass in development when the flag is set", () => {
    const state = resolveDevBypassState({
      NODE_ENV: "development",
      ALLOW_DEV_BYPASS: "true",
    });

    expect(state.enabled).toBe(true);
    expect(state.nodeEnv).toBe("development");
  });

  it("treats empty or falsey values as disabled", () => {
    const disabledState = resolveDevBypassState({
      NODE_ENV: "development",
      ALLOW_DEV_BYPASS: "false",
    });
    const missingState = resolveDevBypassState({
      NODE_ENV: "development",
    });

    expect(disabledState.enabled).toBe(false);
    expect(missingState.enabled).toBe(false);
  });

  it("accepts common truthy flag formats", () => {
    const oneState = resolveDevBypassState({
      NODE_ENV: "development",
      ALLOW_DEV_BYPASS: "1",
    });
    const yesState = resolveDevBypassState({
      NODE_ENV: "development",
      ALLOW_DEV_BYPASS: "yes",
    });

    expect(oneState.enabled).toBe(true);
    expect(yesState.enabled).toBe(true);
  });

  it("throws when bypass is enabled in production", () => {
    expect(() =>
      resolveDevBypassState({
        NODE_ENV: "production",
        ALLOW_DEV_BYPASS: "true",
      }),
    ).toThrowError(/cannot be enabled in production/i);
  });

  it("throws when VERCEL_ENV is production even if NODE_ENV is not", () => {
    expect(() =>
      resolveDevBypassState({
        NODE_ENV: "development",
        VERCEL_ENV: "production",
        ALLOW_DEV_BYPASS: "true",
      }),
    ).toThrowError(/cannot be enabled in production/i);
  });
});
