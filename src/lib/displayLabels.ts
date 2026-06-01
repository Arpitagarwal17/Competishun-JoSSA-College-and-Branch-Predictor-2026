import { normalizeSearchText } from "./normalizeJosaaData";

const SEAT_TYPE_LABELS: Record<string, string> = {
  OPEN: "OPEN - General",
  "OPEN (PwD)": "OPEN (PwD) - General",
  EWS: "GEN-EWS - Economically Weaker Section",
  "EWS (PwD)": "GEN-EWS (PwD) - Economically Weaker Section",
  "OBC-NCL": "OBC-NCL - Non-Creamy Layer",
  "OBC-NCL (PwD)": "OBC-NCL (PwD) - Non-Creamy Layer",
  SC: "SC - Scheduled Caste",
  "SC (PwD)": "SC (PwD) - Scheduled Caste",
  ST: "ST - Scheduled Tribe",
  "ST (PwD)": "ST (PwD) - Scheduled Tribe"
};

const QUOTA_LABELS: Record<string, string> = {
  AI: "All India",
  HS: "Home State",
  OS: "Other State",
  GO: "Goa",
  JK: "Jammu and Kashmir",
  LA: "Ladakh"
};

const SEAT_TYPE_ORDER: Record<string, number> = {
  OPEN: 0,
  EWS: 1,
  "OBC-NCL": 2,
  SC: 3,
  ST: 4
};

const QUOTA_ORDER: Record<string, number> = {
  AI: 0,
  OS: 1,
  HS: 2,
  GO: 3,
  JK: 4,
  LA: 5
};

export function getSeatTypeLabel(seatType: string) {
  return SEAT_TYPE_LABELS[seatType] ?? seatType;
}

export function getQuotaLabel(quota: string) {
  return QUOTA_LABELS[quota] ?? quota;
}

export function getGenderLabel(gender: string) {
  const normalized = normalizeSearchText(gender);

  if (normalized.includes("gender neutral")) {
    return "Gender-Neutral";
  }

  if (normalized.includes("female")) {
    return "Female-only";
  }

  return gender;
}

export function seatTypePriority(seatType: string, baseCategory?: string, isPwD?: boolean) {
  const base = baseCategory ?? seatType.replace(/\s*\(pwd\)\s*/i, "").trim();
  const pwd = isPwD ?? /\(pwd\)/i.test(seatType);
  const baseOrder = SEAT_TYPE_ORDER[base] ?? 99;

  return baseOrder * 2 + (pwd ? 1 : 0);
}

export function quotaPriority(quota: string) {
  return QUOTA_ORDER[quota] ?? 99;
}

export function genderPriority(gender: string) {
  const normalized = normalizeSearchText(gender);

  if (normalized.includes("gender neutral")) {
    return 0;
  }

  if (normalized.includes("female")) {
    return 1;
  }

  return 2;
}
