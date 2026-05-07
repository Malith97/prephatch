import { describe, it } from "vitest";

describe.skip("TASK-000a e2e dev seed flow", () => {
  it("applies dev seed successfully when ALLOW_DEV_BYPASS=true");
  it("is idempotent across repeated seed runs");
  it("refuses to seed when NODE_ENV or VERCEL_ENV is production");
});
