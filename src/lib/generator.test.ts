import { describe, expect, it } from "vitest";
import { generateSamplePackage } from "@/lib/generator";
import { changeRequestPackageSchema } from "@/lib/schema";
import { MIDTOWN_SCENARIO } from "@/lib/sample-scenario";

describe("generateSamplePackage", () => {
  const pkg = generateSamplePackage(MIDTOWN_SCENARIO);

  it("produces a package that satisfies the schema", () => {
    expect(changeRequestPackageSchema.safeParse(pkg).success).toBe(true);
  });

  it("is deterministic", () => {
    expect(generateSamplePackage(MIDTOWN_SCENARIO)).toEqual(pkg);
  });

  it("weaves the report facts into the output", () => {
    expect(pkg.title).toContain(MIDTOWN_SCENARIO.projectName);
    expect(pkg.executiveSummary).toContain(MIDTOWN_SCENARIO.companyName);
    expect(pkg.laborImpact).toContain("Two electricians");
    expect(pkg.emailDraft).toContain(MIDTOWN_SCENARIO.submittedBy.split(",")[0]);
  });

  it("adapts wording to HVAC trade", () => {
    const hvac = generateSamplePackage({ ...MIDTOWN_SCENARIO, trade: "HVAC" });
    expect(hvac.customerFacingRequest.toLowerCase()).toContain("mechanical");
  });
});
