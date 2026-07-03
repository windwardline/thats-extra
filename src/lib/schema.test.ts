import { describe, expect, it } from "vitest";
import { fieldReportSchema } from "@/lib/schema";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

describe("fieldReportSchema", () => {
  it("accepts the Midtown sample scenario", () => {
    expect(fieldReportSchema.safeParse(MIDTOWN_SCENARIO).success).toBe(true);
  });

  it("rejects a bad email and short description", () => {
    const bad = { ...MIDTOWN_SCENARIO, pmEmail: "not-an-email", description: "short" };
    const result = fieldReportSchema.safeParse(bad);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("pmEmail");
      expect(paths).toContain("description");
    }
  });

  it("rejects an unknown trade", () => {
    expect(fieldReportSchema.safeParse({ ...MIDTOWN_SCENARIO, trade: "Plumbing" }).success).toBe(false);
  });
});
