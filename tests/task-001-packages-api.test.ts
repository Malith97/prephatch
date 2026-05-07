import { beforeEach, describe, expect, it } from "vitest";

import { GET as getPackageDetail } from "../app/api/packages/[slug]/route";
import { GET as getPackageList } from "../app/api/packages/route";
import { clearCatalogRepositoryCache } from "../server/catalog/repository";

describe("TASK-001 package catalog API", () => {
  beforeEach(() => {
    clearCatalogRepositoryCache();
  });

  it("returns package catalog list from GET /api/packages", async () => {
    const response = getPackageList();
    expect(response.status).toBe(200);

    const payload = (await response.json()) as {
      data: Array<{ slug: string; title: string }>;
      generatedAt: string;
    };

    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.data.length).toBeGreaterThan(0);
    expect(typeof payload.generatedAt).toBe("string");
    expect(payload.data[0]).toHaveProperty("slug");
    expect(payload.data[0]).toHaveProperty("title");
  });

  it("returns package detail from GET /api/packages/:slug", async () => {
    const response = getPackageDetail(new Request("http://localhost/api/packages/aws-saa-c03"), {
      params: {
        slug: "aws-saa-c03",
      },
    });

    expect(response.status).toBe(200);

    const payload = (await response.json()) as {
      data: { slug: string; title: string };
      generatedAt: string;
    };

    expect(payload.data.slug).toBe("aws-saa-c03");
    expect(typeof payload.data.title).toBe("string");
    expect(payload.data.title.length).toBeGreaterThan(0);
    expect(typeof payload.generatedAt).toBe("string");
  });

  it("rejects invalid slug format with 400", async () => {
    const response = getPackageDetail(
      new Request("http://localhost/api/packages/Bad_Slug"),
      {
        params: {
          slug: "Bad_Slug",
        },
      },
    );

    expect(response.status).toBe(400);

    const payload = (await response.json()) as {
      error: { code: string; message: string };
    };

    expect(payload.error.code).toBe("invalid_package_slug");
  });

  it("returns 404 for unknown package slug", async () => {
    const response = getPackageDetail(
      new Request("http://localhost/api/packages/does-not-exist"),
      {
        params: {
          slug: "does-not-exist",
        },
      },
    );

    expect(response.status).toBe(404);

    const payload = (await response.json()) as {
      error: { code: string; message: string };
    };

    expect(payload.error.code).toBe("package_not_found");
  });
});
