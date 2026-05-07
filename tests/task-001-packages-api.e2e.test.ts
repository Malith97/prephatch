import { describe, it } from "vitest";

describe.skip("TASK-001 package catalog e2e", () => {
  it("fetches package list from GET /api/packages");
  it("fetches package detail from GET /api/packages/:slug");
  it("returns 400 for invalid package_slug values");
});
