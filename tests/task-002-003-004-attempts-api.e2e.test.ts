import { describe, it } from "vitest";

describe.skip("TASK-002/003/004 attempts API e2e", () => {
  it("creates and resumes a server-backed attempt across multiple tabs/devices");
  it("autosaves partial answers and rejects stale writes with version conflict");
  it("rejects autosave updates after deadline expiration");
  it("submits once and keeps duplicate submit calls idempotent");
});
