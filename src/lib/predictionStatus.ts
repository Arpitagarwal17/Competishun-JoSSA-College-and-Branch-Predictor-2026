import type { CollegeType, CutoffRow, PredictionStatus } from "./types";

export function requiredRankTypeForCollegeType(collegeType: CollegeType): "JEE Advanced" | "JEE Main" {
  return collegeType === "IIT" ? "JEE Advanced" : "JEE Main";
}

export function rankForCollegeType(
  collegeType: CollegeType,
  advancedRank: number | null,
  mainRank: number | null
) {
  return collegeType === "IIT" ? advancedRank : mainRank;
}

export function getPredictionStatus(row: CutoffRow, advancedRank: number | null, mainRank: number | null) {
  const rankUsed = rankForCollegeType(row.collegeType, advancedRank, mainRank);
  const rankTypeRequired = requiredRankTypeForCollegeType(row.collegeType);

  if (!rankUsed || rankUsed <= 0) {
    return {
      predictionStatus: "Rank required" as PredictionStatus,
      rankUsed: null,
      rankTypeRequired
    };
  }

  if (rankUsed <= row.closingRank) {
    return {
      predictionStatus: "Eligible" as PredictionStatus,
      rankUsed,
      rankTypeRequired
    };
  }

  return {
    predictionStatus: "Not eligible" as PredictionStatus,
    rankUsed,
    rankTypeRequired
  };
}

export function isPossibleStatus(status: PredictionStatus) {
  return status === "Eligible";
}
