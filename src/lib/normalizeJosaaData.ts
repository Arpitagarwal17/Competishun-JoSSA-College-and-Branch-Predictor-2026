import type { BranchGroupId } from "./types";

export function cleanText(value: unknown): string {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSearchText(value: unknown): string {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCompactText(value: unknown): string {
  return normalizeSearchText(value).replace(/\s+/g, "");
}

export function parseSeatType(seatType: string) {
  const cleaned = cleanText(seatType);
  const isPwD = /\bpwd\b/i.test(cleaned);
  const baseCategory = cleaned.replace(/\s*\(?\s*PwD\s*\)?/gi, "").replace(/\s+/g, " ").trim();

  return {
    seatType: cleaned,
    baseCategory,
    isPwD
  };
}

export function branchLabel(id: BranchGroupId): string {
  return id === "other" ? "Other / Unclassified" : id;
}
