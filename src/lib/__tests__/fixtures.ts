import { COLLEGE_TYPE_PRIORITY } from "../branchGroups";
import { classifyBranch } from "../classifyBranch";
import { normalizeSearchText, parseSeatType } from "../normalizeJosaaData";
import type { CollegeType, CutoffRow } from "../types";

let sequence = 0;

export function makeRow(overrides: Partial<CutoffRow> = {}): CutoffRow {
  const collegeType = overrides.collegeType ?? "NIT";
  const program = overrides.program ?? "Computer Science and Engineering";
  const seatType = overrides.seatType ?? "OPEN";
  const seat = parseSeatType(seatType);
  const classification = classifyBranch(program);
  sequence += 1;

  return {
    id: overrides.id ?? `fixture-${sequence}`,
    collegeType,
    collegeTypePriority: overrides.collegeTypePriority ?? COLLEGE_TYPE_PRIORITY[collegeType as CollegeType],
    institute: overrides.institute ?? "Fixture Institute",
    program,
    quota: overrides.quota ?? "AI",
    seatType,
    gender: overrides.gender ?? "Gender-Neutral",
    openingRank: overrides.openingRank ?? 100,
    closingRank: overrides.closingRank ?? 1000,
    openingRankDisplay: overrides.openingRankDisplay ?? String(overrides.openingRank ?? 100),
    closingRankDisplay: overrides.closingRankDisplay ?? String(overrides.closingRank ?? 1000),
    institutePreferenceRank: overrides.institutePreferenceRank ?? overrides.openingRank ?? 100,
    normalizedProgram: overrides.normalizedProgram ?? normalizeSearchText(program),
    normalizedInstitute: overrides.normalizedInstitute ?? normalizeSearchText(overrides.institute ?? "Fixture Institute"),
    branchGroups: overrides.branchGroups ?? classification.branchGroups,
    primaryBranchGroup: overrides.primaryBranchGroup ?? classification.primaryBranchGroup,
    branchMatchReasons: overrides.branchMatchReasons ?? classification.branchMatchReasons,
    baseCategory: overrides.baseCategory ?? seat.baseCategory,
    isPwD: overrides.isPwD ?? seat.isPwD,
    sourceFile: overrides.sourceFile ?? "fixture.xlsx"
  };
}
