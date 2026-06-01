export type CollegeType = "IIT" | "NIT" | "IIIT" | "GFTI";

export type PredictionStatus =
  | "Eligible"
  | "Not eligible"
  | "Rank required";

export type CandidateGenderMode = "male-other" | "female" | "manual" | "all";

export type CourseDuration = "4" | "5";

export type CourseDegree =
  | "btech"
  | "btech-mtech"
  | "btech-mba"
  | "bs"
  | "bs-dual"
  | "bsc"
  | "be"
  | "barch"
  | "bplan"
  | "bdes"
  | "other";

export type BranchGroupId =
  | "cse"
  | "ai"
  | "ece"
  | "electrical"
  | "mechanical"
  | "civil"
  | "chemical"
  | "maths"
  | "physics"
  | "architecture"
  | "biotech"
  | "metallurgy"
  | "mining"
  | "aerospace"
  | "production"
  | "instrumentation"
  | "energy"
  | "environmental"
  | "textile"
  | "food"
  | "other";

export interface BranchGroup {
  id: BranchGroupId;
  displayName: string;
  shortName: string;
  aliases: string[];
  exactKeywords: string[];
  includeKeywords: string[];
  excludeKeywords: string[];
  relatedGroupIds: BranchGroupId[];
}

export interface BranchClassification {
  branchGroups: BranchGroupId[];
  primaryBranchGroup: BranchGroupId;
  branchMatchReasons: Partial<Record<BranchGroupId, string[]>>;
}

export interface CutoffRow {
  id: string;
  collegeType: CollegeType;
  collegeTypePriority: number;
  institute: string;
  program: string;
  quota: string;
  seatType: string;
  gender: string;
  openingRank: number;
  closingRank: number;
  openingRankDisplay: string;
  closingRankDisplay: string;
  institutePreferenceRank: number;
  normalizedProgram: string;
  normalizedInstitute: string;
  branchGroups: BranchGroupId[];
  primaryBranchGroup: BranchGroupId;
  branchMatchReasons: Partial<Record<BranchGroupId, string[]>>;
  baseCategory: string;
  isPwD: boolean;
  sourceFile: string;
}

export interface FilteredCutoffRow extends CutoffRow {
  predictionStatus: PredictionStatus;
  rankUsed: number | null;
  rankTypeRequired: "JEE Advanced" | "JEE Main";
  matchedBranchGroupIds: BranchGroupId[];
  matchedBecause: string;
}

export interface JosaaFilters {
  collegeTypes: CollegeType[];
  advancedRank: number | null;
  mainRank: number | null;
  branchGroupIds: BranchGroupId[];
  courseDurations: CourseDuration[];
  degreeTypes: CourseDegree[];
  homeState: string;
  programQuery: string;
  seatTypes: string[];
  genderMode: CandidateGenderMode;
  manualGenders: string[];
  quotas: string[];
  institutes: string[];
  includeRelatedBranches: boolean;
  showOnlyPossible: boolean;
  showBorderline: boolean;
  showAllCutoffs: boolean;
}

export interface FilterOptions {
  seatTypes: string[];
  genders: string[];
  quotas: string[];
  institutes: string[];
}

export interface SourceQualityReport {
  sourceFile: string;
  collegeType: CollegeType;
  rawRows: number;
  validRows: number;
  invalidRows: number;
  duplicatesRemoved: number;
  missingOpeningRank: number;
  missingClosingRank: number;
  invalidOpeningRank: number;
  invalidClosingRank: number;
  rankSuffixRows: number;
}

export interface DataQualityReport {
  generatedAt: string | null;
  totalRawRows: number;
  totalValidRows: number;
  totalInvalidRows: number;
  totalDuplicatesRemoved: number;
  sourceFiles: SourceQualityReport[];
  rowCountsByCollegeType: Record<string, number>;
  branchGroupCounts: Record<string, number>;
  unclassifiedProgramCount: number;
  unclassifiedPrograms: string[];
  seatTypes: string[];
  unknownSeatTypes: string[];
  quotas: string[];
  uncommonQuotas: string[];
  genders: string[];
  instituteCount: number;
  programCount: number;
  rankSuffixRows: number;
  missingRankRows: number;
  invalidRankRows: number;
  validationNotes: string[];
}
