import type { DataQualityReport } from "./types";

export const KNOWN_BASE_SEAT_TYPES = ["OPEN", "GEN-EWS", "OBC-NCL", "SC", "ST"];
export const COMMON_QUOTAS = ["AI", "HS", "OS", "GO", "JK", "LA"];

export function makeEmptyQualityReport(): DataQualityReport {
  return {
    generatedAt: null,
    totalRawRows: 0,
    totalValidRows: 0,
    totalInvalidRows: 0,
    totalDuplicatesRemoved: 0,
    sourceFiles: [],
    rowCountsByCollegeType: {},
    branchGroupCounts: {},
    unclassifiedProgramCount: 0,
    unclassifiedPrograms: [],
    seatTypes: [],
    unknownSeatTypes: [],
    quotas: [],
    uncommonQuotas: [],
    genders: [],
    instituteCount: 0,
    programCount: 0,
    rankSuffixRows: 0,
    missingRankRows: 0,
    invalidRankRows: 0,
    validationNotes: []
  };
}
