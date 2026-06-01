import { BRANCH_GROUPS, COLLEGE_TYPES, getBranchGroup } from "./branchGroups";
import { getCourseDegree } from "./courseDegrees";
import { quotaPriority, seatTypePriority } from "./displayLabels";
import { isQuotaAllowedForHomeState } from "./homeStates";
import { normalizeSearchText } from "./normalizeJosaaData";
import { getPredictionStatus, isPossibleStatus } from "./predictionStatus";
import { sortJosaaResults } from "./sortJosaaResults";
import type { BranchGroupId, CollegeType, CourseDuration, CutoffRow, FilteredCutoffRow, FilterOptions, JosaaFilters } from "./types";

export function createDefaultFilters(): JosaaFilters {
  return {
    collegeTypes: [],
    advancedRank: null,
    mainRank: null,
    branchGroupIds: [],
    courseDurations: [],
    degreeTypes: [],
    homeState: "",
    programQuery: "",
    seatTypes: [],
    genderMode: "male-other",
    manualGenders: [],
    quotas: [],
    institutes: [],
    includeRelatedBranches: false,
    showOnlyPossible: false,
    showBorderline: false,
    showAllCutoffs: true
  };
}

export function buildFilterOptions(rows: CutoffRow[]): FilterOptions {
  return {
    seatTypes: uniqueSorted(
      rows.map((row) => row.seatType),
      (a, b) => seatTypePriority(a) - seatTypePriority(b) || a.localeCompare(b)
    ),
    genders: uniqueSorted(rows.map((row) => row.gender)),
    quotas: uniqueSorted(
      rows.map((row) => row.quota),
      (a, b) => quotaPriority(a) - quotaPriority(b) || a.localeCompare(b)
    ),
    institutes: uniqueSorted(rows.map((row) => row.institute))
  };
}

function uniqueSorted(values: string[], compare: (a: string, b: string) => number = (a, b) => a.localeCompare(b)) {
  return Array.from(new Set(values.filter(Boolean))).sort(compare);
}

export function getEffectiveCollegeTypes(filters: Pick<JosaaFilters, "advancedRank" | "collegeTypes" | "mainRank">): CollegeType[] {
  const selectedTypes = filters.collegeTypes.length ? filters.collegeTypes : [...COLLEGE_TYPES];
  const hasAdvancedRank = Boolean(filters.advancedRank && filters.advancedRank > 0);
  const hasMainRank = Boolean(filters.mainRank && filters.mainRank > 0);

  if (!hasAdvancedRank && !hasMainRank) {
    return selectedTypes;
  }

  const allowedTypes = new Set<CollegeType>();

  if (hasAdvancedRank) {
    allowedTypes.add("IIT");
  }

  if (hasMainRank) {
    allowedTypes.add("NIT");
    allowedTypes.add("IIIT");
    allowedTypes.add("GFTI");
  }

  return selectedTypes.filter((type) => allowedTypes.has(type));
}

function getAcceptedBranchIds(selectedIds: BranchGroupId[], includeRelatedBranches: boolean) {
  const direct = new Set(selectedIds);
  const related = new Set<BranchGroupId>();

  if (includeRelatedBranches) {
    for (const id of selectedIds) {
      const group = getBranchGroup(id);
      group?.relatedGroupIds.forEach((relatedId) => related.add(relatedId));
    }
  }

  return {
    direct,
    related,
    all: new Set<BranchGroupId>([...direct, ...related])
  };
}

function matchesGender(row: CutoffRow, filters: JosaaFilters) {
  if (filters.genderMode === "all") {
    return true;
  }

  if (filters.genderMode === "manual") {
    return filters.manualGenders.length === 0 || filters.manualGenders.includes(row.gender);
  }

  const normalizedGender = normalizeSearchText(row.gender);
  const isFemaleOnly = normalizedGender.includes("female");
  const isGenderNeutral = normalizedGender.includes("gender neutral");

  if (filters.genderMode === "female") {
    return isGenderNeutral || isFemaleOnly;
  }

  return isGenderNeutral && !isFemaleOnly;
}

export function getCourseDuration(program: string): CourseDuration | null {
  const match = program.match(/\b([45])\s+Years?\b/i);
  return match ? (match[1] as CourseDuration) : null;
}

function formatMatchReason(row: CutoffRow, matchedIds: BranchGroupId[], selectedIds: BranchGroupId[]) {
  if (matchedIds.length === 0) {
    return "";
  }

  const preferredId = matchedIds.find((id) => selectedIds.includes(id)) ?? matchedIds[0];
  const groupName = BRANCH_GROUPS.find((group) => group.id === preferredId)?.displayName ?? preferredId;
  const reason = row.branchMatchReasons[preferredId]?.[0];

  if (reason) {
    return `Matched under ${groupName} because ${reason}.`;
  }

  return `Matched under ${groupName}.`;
}

export function filterJosaaData(rows: CutoffRow[], filters: JosaaFilters): FilteredCutoffRow[] {
  const selectedCollegeTypes = new Set<CollegeType>(getEffectiveCollegeTypes(filters));
  const selectedSeatTypes = new Set(filters.seatTypes);
  const selectedQuotas = new Set(filters.quotas);
  const selectedInstitutes = new Set(filters.institutes);
  const selectedCourseDurations = new Set(filters.courseDurations);
  const selectedDegreeTypes = new Set(filters.degreeTypes);
  const hasRank = Boolean((filters.advancedRank && filters.advancedRank > 0) || (filters.mainRank && filters.mainRank > 0));
  const programQuery = normalizeSearchText(filters.programQuery);
  const selectedBranchIds = filters.branchGroupIds;
  const acceptedBranchIds = getAcceptedBranchIds(selectedBranchIds, filters.includeRelatedBranches);

  const filtered: FilteredCutoffRow[] = [];

  for (const row of rows) {
    if (!selectedCollegeTypes.has(row.collegeType)) {
      continue;
    }

    if (selectedSeatTypes.size > 0 && !selectedSeatTypes.has(row.seatType)) {
      continue;
    }

    if (selectedQuotas.size > 0 && !selectedQuotas.has(row.quota)) {
      continue;
    }

    if (!isQuotaAllowedForHomeState(row, filters.homeState)) {
      continue;
    }

    if (selectedInstitutes.size > 0 && !selectedInstitutes.has(row.institute)) {
      continue;
    }

    if (selectedCourseDurations.size > 0) {
      const courseDuration = getCourseDuration(row.program);

      if (!courseDuration || !selectedCourseDurations.has(courseDuration)) {
        continue;
      }
    }

    if (selectedDegreeTypes.size > 0 && !selectedDegreeTypes.has(getCourseDegree(row.program))) {
      continue;
    }

    if (!matchesGender(row, filters)) {
      continue;
    }

    if (programQuery && !row.normalizedProgram.includes(programQuery)) {
      continue;
    }

    let matchedBranchGroupIds = row.branchGroups;
    if (selectedBranchIds.length > 0) {
      matchedBranchGroupIds = row.branchGroups.filter((id) => acceptedBranchIds.all.has(id));
      if (matchedBranchGroupIds.length === 0) {
        continue;
      }
    }

    const prediction = getPredictionStatus(row, filters.advancedRank, filters.mainRank);

    if (hasRank) {
      const allowed = isPossibleStatus(prediction.predictionStatus);

      if (!allowed) {
        continue;
      }
    }

    filtered.push({
      ...row,
      ...prediction,
      matchedBranchGroupIds,
      matchedBecause: formatMatchReason(row, matchedBranchGroupIds, selectedBranchIds)
    });
  }

  return sortJosaaResults(filtered);
}

export function summarizeResults(rows: FilteredCutoffRow[]) {
  return {
    total: rows.length,
    eligible: rows.filter((row) => row.predictionStatus === "Eligible").length,
    notEligible: rows.filter((row) => row.predictionStatus === "Not eligible").length,
    rankRequired: rows.filter((row) => row.predictionStatus === "Rank required").length
  };
}
