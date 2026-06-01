import { genderPriority, quotaPriority, seatTypePriority } from "./displayLabels";
import type { FilteredCutoffRow, PredictionStatus } from "./types";

const STATUS_ORDER: Record<PredictionStatus, number> = {
  Eligible: 0,
  "Rank required": 1,
  "Not eligible": 2
};

const MISSING_PREFERENCE = 999_999_999;

export function sortJosaaResults(rows: FilteredCutoffRow[]) {
  return [...rows].sort((a, b) => {
    if (a.collegeTypePriority !== b.collegeTypePriority) {
      return a.collegeTypePriority - b.collegeTypePriority;
    }

    const statusDelta = STATUS_ORDER[a.predictionStatus] - STATUS_ORDER[b.predictionStatus];
    if (statusDelta !== 0) {
      return statusDelta;
    }

    const institutePreferenceDelta =
      (a.institutePreferenceRank ?? MISSING_PREFERENCE) - (b.institutePreferenceRank ?? MISSING_PREFERENCE);
    if (institutePreferenceDelta !== 0) {
      return institutePreferenceDelta;
    }

    const instituteDelta = a.institute.localeCompare(b.institute);
    if (instituteDelta !== 0) {
      return instituteDelta;
    }

    const quotaDelta = quotaPriority(a.quota) - quotaPriority(b.quota);
    if (quotaDelta !== 0) {
      return quotaDelta;
    }

    const genderDelta = genderPriority(a.gender) - genderPriority(b.gender);
    if (genderDelta !== 0) {
      return genderDelta;
    }

    const seatTypeDelta =
      seatTypePriority(a.seatType, a.baseCategory, a.isPwD) - seatTypePriority(b.seatType, b.baseCategory, b.isPwD);
    if (seatTypeDelta !== 0) {
      return seatTypeDelta;
    }

    if (a.closingRank !== b.closingRank) {
      return a.closingRank - b.closingRank;
    }

    if (a.openingRank !== b.openingRank) {
      return a.openingRank - b.openingRank;
    }

    return a.program.localeCompare(b.program);
  });
}
