import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

const migrationSql = readFileSync(
  resolve(
    process.cwd(),
    "supabase/migrations/20260507143000_task_000a_dev_seed_schema.sql",
  ),
  "utf8",
);

const seedSql = readFileSync(
  resolve(process.cwd(), "supabase/seeds/00_task_000a_dev_seed.sql"),
  "utf8",
);

const seedScript = readFileSync(
  resolve(process.cwd(), "scripts/seed-dev-data.sh"),
  "utf8",
);

describe("TASK-000a seed assets", () => {
  it("creates dev users, package, question, and entitlement tables", () => {
    expect(migrationSql).toContain("create table if not exists public.dev_users");
    expect(migrationSql).toContain(
      "create table if not exists public.exam_packages",
    );
    expect(migrationSql).toContain(
      "create table if not exists public.exam_questions",
    );
    expect(migrationSql).toContain(
      "create table if not exists public.package_entitlements",
    );
  });

  it("seeds users, packages, questions, and entitlements", () => {
    expect(seedSql).toContain("insert into public.dev_users");
    expect(seedSql).toContain("insert into public.exam_packages");
    expect(seedSql).toContain("insert into public.exam_questions");
    expect(seedSql).toContain("insert into public.package_entitlements");
    expect(seedSql).toContain("[task-000a] seed complete:");
  });

  it("enforces production-safe seeding guards in seed script", () => {
    expect(seedScript).toContain("NODE_ENV");
    expect(seedScript).toContain("VERCEL_ENV");
    expect(seedScript).toContain("ALLOW_DEV_BYPASS");
    expect(seedScript).toContain("supabase db query --file");
  });
});
