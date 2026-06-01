import { describe, expect, it } from "vitest";
import reportJson from "../../data/dataQualityReport.json";
import type { DataQualityReport } from "../types";

const report = reportJson as DataQualityReport;

describe("generated data quality report", () => {
  it("is generated successfully", () => {
    expect(report.generatedAt).toBeTruthy();
    expect(report.totalValidRows).toBeGreaterThan(0);
    expect(report.sourceFiles.map((source) => source.collegeType)).toEqual(["IIT", "NIT", "IIIT", "GFTI"]);
  });
});
