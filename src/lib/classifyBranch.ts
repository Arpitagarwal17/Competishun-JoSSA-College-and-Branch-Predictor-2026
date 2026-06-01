import { BRANCH_GROUPS } from "./branchGroups";
import { normalizeSearchText } from "./normalizeJosaaData";
import type { BranchClassification, BranchGroupId } from "./types";

const GROUP_PRIORITY: BranchGroupId[] = [
  "cse",
  "ai",
  "ece",
  "electrical",
  "maths",
  "mechanical",
  "civil",
  "chemical",
  "architecture",
  "biotech",
  "aerospace",
  "metallurgy",
  "mining",
  "production",
  "instrumentation",
  "physics",
  "energy",
  "environmental",
  "textile",
  "food",
  "other"
];

function keywordMatches(text: string, keyword: string): boolean {
  const normalizedKeyword = normalizeSearchText(keyword);
  if (!normalizedKeyword) {
    return false;
  }

  return text.includes(normalizedKeyword);
}

function makeReason(keyword: string): string {
  return `program contains ${keyword}`;
}

export function classifyBranch(program: string): BranchClassification {
  const normalized = normalizeSearchText(program);
  const branchGroups: BranchGroupId[] = [];
  const branchMatchReasons: BranchClassification["branchMatchReasons"] = {};

  for (const group of BRANCH_GROUPS) {
    if (group.id === "other") {
      continue;
    }

    const excluded = group.excludeKeywords.some((keyword) => keywordMatches(normalized, keyword));
    if (excluded) {
      continue;
    }

    const exactHits = group.exactKeywords.filter((keyword) => normalized === normalizeSearchText(keyword));
    const includeHits = group.includeKeywords.filter((keyword) => keywordMatches(normalized, keyword));
    const hits = Array.from(new Set([...exactHits, ...includeHits]));

    if (hits.length > 0) {
      branchGroups.push(group.id);
      branchMatchReasons[group.id] = hits.map(makeReason);
    }
  }

  if (branchGroups.length === 0) {
    return {
      branchGroups: ["other"],
      primaryBranchGroup: "other",
      branchMatchReasons: {
        other: ["no branch rule matched this program"]
      }
    };
  }

  const primaryBranchGroup =
    GROUP_PRIORITY.find((id) => branchGroups.includes(id)) ?? branchGroups[0] ?? "other";

  return {
    branchGroups,
    primaryBranchGroup,
    branchMatchReasons
  };
}

export function findBranchGroupsForSearch(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) {
    return BRANCH_GROUPS;
  }

  const compact = normalized.replace(/\s+/g, "");

  return BRANCH_GROUPS.filter((group) => {
    const haystack = [
      group.displayName,
      group.shortName,
      ...group.aliases,
      ...group.exactKeywords,
      ...group.includeKeywords
    ].map(normalizeSearchText);

    return haystack.some((value) => {
      const valueCompact = value.replace(/\s+/g, "");
      return value.includes(normalized) || valueCompact.includes(compact);
    });
  });
}
