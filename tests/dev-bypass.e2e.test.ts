import { describe, it } from "vitest";

describe.skip("TASK-000 e2e auth bypass flow", () => {
  it("allows protected route access with ALLOW_DEV_BYPASS=true in development");
  it("redirects protected routes to /login when bypass is disabled");
  it("rejects startup if bypass is enabled in production");
});
