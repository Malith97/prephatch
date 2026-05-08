import { describe, expect, it } from "vitest";

import { evaluateMiddlewareAccess } from "../middleware";

describe("evaluateMiddlewareAccess", () => {
  it("allows public routes without bypass header", () => {
    const decision = evaluateMiddlewareAccess({
      pathname: "/",
      method: "GET",
      hasSession: false,
    });

    expect(decision).toEqual({
      kind: "next",
      bypassEnabled: false,
    });
  });

  it("allows protected routes in dev bypass mode", () => {
    const decision = evaluateMiddlewareAccess({
      pathname: "/dashboard",
      method: "GET",
      search: "?mock=1",
      hasSession: false,
      devBypassState: {
        enabled: true,
        nodeEnv: "development",
      },
    });

    expect(decision.kind).toBe("next");
    if (decision.kind !== "next") {
      return;
    }

    expect(decision.bypassEnabled).toBe(true);
    expect(decision.bypassLogMessage).toContain("[auth-bypass]");
  });

  it("enforces auth on protected routes when bypass is disabled", () => {
    const decision = evaluateMiddlewareAccess({
      pathname: "/exam/aws-saa-c03",
      method: "GET",
      hasSession: false,
      devBypassState: {
        enabled: false,
        nodeEnv: "development",
      },
    });

    expect(decision).toEqual({
      kind: "redirect",
    });
  });

  it("allows protected routes with session cookie when bypass is disabled", () => {
    const decision = evaluateMiddlewareAccess({
      pathname: "/seller",
      method: "GET",
      hasSession: true,
      devBypassState: {
        enabled: false,
        nodeEnv: "development",
      },
    });

    expect(decision).toEqual({
      kind: "next",
      bypassEnabled: false,
    });
  });

  it("skips bypass log message in test environment", () => {
    const decision = evaluateMiddlewareAccess({
      pathname: "/dashboard",
      method: "POST",
      hasSession: false,
      devBypassState: {
        enabled: true,
        nodeEnv: "test",
      },
    });

    expect(decision.kind).toBe("next");
    if (decision.kind !== "next") {
      return;
    }

    expect(decision.bypassEnabled).toBe(true);
    expect(decision.bypassLogMessage).toBeUndefined();
  });
});
