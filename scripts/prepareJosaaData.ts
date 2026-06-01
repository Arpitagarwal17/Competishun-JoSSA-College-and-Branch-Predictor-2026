import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import readXlsxFile from "read-excel-file/node";
import { COLLEGE_TYPE_PRIORITY } from "../src/lib/branchGroups";
import { classifyBranch } from "../src/lib/classifyBranch";
import { cleanText, normalizeSearchText, parseSeatType } from "../src/lib/normalizeJosaaData";
import { COMMON_QUOTAS, KNOWN_BASE_SEAT_TYPES, makeEmptyQualityReport } from "../src/lib/dataValidation";
import type { CollegeType, CutoffRow, DataQualityReport, SourceQualityReport } from "../src/lib/types";

type SourceConfig = {
  sourceFile: string;
  collegeType: CollegeType;
};

type RawWorkbookRow = {
  Institute?: unknown;
  "Academic Program Name"?: unknown;
  Quota?: unknown;
  "Seat Type"?: unknown;
  Gender?: unknown;
  "Opening Rank"?: unknown;
  "Closing Rank"?: unknown;
};

const ROOT_DIR = path.resolve(__dirname, "..");
const INSTITUTE_PREFERENCE_STAGE_WEIGHT = 100_000_000;
const MISSING_INSTITUTE_PREFERENCE = 999_999_999;
const SOURCE_FILES: SourceConfig[] = [
  { sourceFile: "iits.xlsx", collegeType: "IIT" },
  { sourceFile: "nits.xlsx", collegeType: "NIT" },
  { sourceFile: "iiits.xlsx", collegeType: "IIIT" },
  { sourceFile: "gfti.xlsx", collegeType: "GFTI" }
];

function parseRank(value: unknown) {
  const raw = cleanText(value);

  if (!raw) {
    return {
      value: null,
      display: "",
      missing: true,
      invalid: false,
      hasSuffix: false
    };
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return {
      value: Math.trunc(value),
      display: String(Math.trunc(value)),
      missing: false,
      invalid: false,
      hasSuffix: false
    };
  }

  const normalized = raw.replace(/,/g, "");
  const match = normalized.match(/^(\d+)([a-zA-Z]+)?$/);

  if (!match) {
    return {
      value: null,
      display: raw,
      missing: false,
      invalid: true,
      hasSuffix: false
    };
  }

  return {
    value: Number(match[1]),
    display: raw,
    missing: false,
    invalid: false,
    hasSuffix: Boolean(match[2])
  };
}

function stableId(parts: string[]) {
  return crypto.createHash("sha1").update(parts.join("\u001f")).digest("hex").slice(0, 16);
}

function cellValue(value: unknown): unknown {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value !== "object") {
    return value;
  }

  const objectValue = value as Record<string, unknown>;

  if ("result" in objectValue) {
    return objectValue.result ?? "";
  }

  if (typeof objectValue.text === "string") {
    return objectValue.text;
  }

  if (Array.isArray(objectValue.richText)) {
    return objectValue.richText
      .map((part) => (typeof part === "object" && part && "text" in part ? String(part.text ?? "") : ""))
      .join("");
  }

  if ("hyperlink" in objectValue && typeof objectValue.text === "string") {
    return objectValue.text;
  }

  return String(value);
}

async function readWorkbookRows(sourceFile: string) {
  const parsedWorkbook = (await readXlsxFile(path.join(ROOT_DIR, sourceFile))) as unknown;
  let worksheetRows: unknown[][] = [];

  if (Array.isArray(parsedWorkbook)) {
    worksheetRows = Array.isArray(parsedWorkbook[0])
      ? (parsedWorkbook as unknown[][])
      : ((parsedWorkbook[0] as { data?: unknown[][] } | undefined)?.data ?? []);
  }

  const headers: unknown[] = worksheetRows[0] ?? [];
  const rows: RawWorkbookRow[] = [];

  for (const row of worksheetRows.slice(1)) {
    const output: Record<string, unknown> = {};
    for (let columnIndex = 0; columnIndex < headers.length; columnIndex += 1) {
      const header = cleanText(cellValue(headers[columnIndex]));
      if (header) {
        output[header] = cellValue(row[columnIndex]);
      }
    }

    rows.push(output as RawWorkbookRow);
  }

  return rows;
}

function makeDedupKey(row: CutoffRow) {
  return [
    row.collegeType,
    row.institute,
    row.program,
    row.quota,
    row.seatType,
    row.gender,
    row.openingRankDisplay,
    row.closingRankDisplay
  ].join("\u001f");
}

function isGenderNeutral(gender: string) {
  return normalizeSearchText(gender).includes("gender neutral");
}

function getInstitutePreferenceScore(row: CutoffRow) {
  const isCse = row.branchGroups.includes("cse");
  const isOpen = row.baseCategory === "OPEN";
  const isCleanOpenGenderNeutral = isOpen && !row.isPwD && isGenderNeutral(row.gender);

  if (isCse && isCleanOpenGenderNeutral && row.quota === "AI") {
    return row.openingRank;
  }

  if (isCse && isCleanOpenGenderNeutral) {
    return INSTITUTE_PREFERENCE_STAGE_WEIGHT + row.openingRank;
  }

  if (isCse && !row.isPwD && isGenderNeutral(row.gender)) {
    return INSTITUTE_PREFERENCE_STAGE_WEIGHT * 2 + row.openingRank;
  }

  if (isCse) {
    return INSTITUTE_PREFERENCE_STAGE_WEIGHT * 3 + row.openingRank;
  }

  if (isCleanOpenGenderNeutral) {
    return INSTITUTE_PREFERENCE_STAGE_WEIGHT * 4 + row.openingRank;
  }

  return INSTITUTE_PREFERENCE_STAGE_WEIGHT * 5 + row.openingRank;
}

function applyInstitutePreferenceRanks(rows: CutoffRow[]) {
  const bestScores = new Map<string, number>();

  for (const row of rows) {
    const score = getInstitutePreferenceScore(row);
    const current = bestScores.get(row.institute) ?? MISSING_INSTITUTE_PREFERENCE;

    if (score < current) {
      bestScores.set(row.institute, score);
    }
  }

  for (const row of rows) {
    row.institutePreferenceRank = bestScores.get(row.institute) ?? MISSING_INSTITUTE_PREFERENCE;
  }
}

async function prepare() {
  const rows: CutoffRow[] = [];
  const seen = new Set<string>();
  const report: DataQualityReport = makeEmptyQualityReport();
  const seatTypes = new Set<string>();
  const baseSeatTypes = new Set<string>();
  const quotas = new Set<string>();
  const genders = new Set<string>();
  const institutes = new Set<string>();
  const programs = new Set<string>();
  const unclassifiedPrograms = new Set<string>();

  for (const source of SOURCE_FILES) {
    const workbookRows = await readWorkbookRows(source.sourceFile);
    const sourceReport: SourceQualityReport = {
      sourceFile: source.sourceFile,
      collegeType: source.collegeType,
      rawRows: 0,
      validRows: 0,
      invalidRows: 0,
      duplicatesRemoved: 0,
      missingOpeningRank: 0,
      missingClosingRank: 0,
      invalidOpeningRank: 0,
      invalidClosingRank: 0,
      rankSuffixRows: 0
    };

    for (const rawRow of workbookRows) {
      const institute = cleanText(rawRow.Institute);
      const program = cleanText(rawRow["Academic Program Name"]);
      const quota = cleanText(rawRow.Quota);
      const seatTypeValue = parseSeatType(cleanText(rawRow["Seat Type"]));
      const gender = cleanText(rawRow.Gender);
      const openingRank = parseRank(rawRow["Opening Rank"]);
      const closingRank = parseRank(rawRow["Closing Rank"]);

      const blank = !institute && !program && !quota && !seatTypeValue.seatType && !gender;
      if (blank) {
        continue;
      }

      sourceReport.rawRows += 1;
      report.totalRawRows += 1;

      if (openingRank.missing) {
        sourceReport.missingOpeningRank += 1;
      }
      if (closingRank.missing) {
        sourceReport.missingClosingRank += 1;
      }
      if (openingRank.invalid) {
        sourceReport.invalidOpeningRank += 1;
      }
      if (closingRank.invalid) {
        sourceReport.invalidClosingRank += 1;
      }
      if (openingRank.hasSuffix || closingRank.hasSuffix) {
        sourceReport.rankSuffixRows += 1;
      }

      const invalid =
        !institute ||
        !program ||
        !quota ||
        !seatTypeValue.seatType ||
        !gender ||
        openingRank.value === null ||
        closingRank.value === null;

      if (invalid) {
        sourceReport.invalidRows += 1;
        continue;
      }

      const classification = classifyBranch(program);
      const row: CutoffRow = {
        id: stableId([
          source.collegeType,
          institute,
          program,
          quota,
          seatTypeValue.seatType,
          gender,
          openingRank.display,
          closingRank.display
        ]),
        collegeType: source.collegeType,
        collegeTypePriority: COLLEGE_TYPE_PRIORITY[source.collegeType],
        institute,
        program,
        quota,
        seatType: seatTypeValue.seatType,
        gender,
        openingRank: openingRank.value,
        closingRank: closingRank.value,
        openingRankDisplay: openingRank.display,
        closingRankDisplay: closingRank.display,
        institutePreferenceRank: MISSING_INSTITUTE_PREFERENCE,
        normalizedProgram: normalizeSearchText(program),
        normalizedInstitute: normalizeSearchText(institute),
        branchGroups: classification.branchGroups,
        primaryBranchGroup: classification.primaryBranchGroup,
        branchMatchReasons: classification.branchMatchReasons,
        baseCategory: seatTypeValue.baseCategory,
        isPwD: seatTypeValue.isPwD,
        sourceFile: source.sourceFile
      };

      const dedupKey = makeDedupKey(row);
      if (seen.has(dedupKey)) {
        sourceReport.duplicatesRemoved += 1;
        continue;
      }

      seen.add(dedupKey);
      rows.push(row);
      sourceReport.validRows += 1;

      seatTypes.add(row.seatType);
      baseSeatTypes.add(row.baseCategory);
      quotas.add(row.quota);
      genders.add(row.gender);
      institutes.add(row.institute);
      programs.add(row.program);

      report.rowCountsByCollegeType[row.collegeType] = (report.rowCountsByCollegeType[row.collegeType] ?? 0) + 1;
      for (const groupId of row.branchGroups) {
        report.branchGroupCounts[groupId] = (report.branchGroupCounts[groupId] ?? 0) + 1;
      }
      if (row.primaryBranchGroup === "other") {
        unclassifiedPrograms.add(row.program);
      }
    }

    report.sourceFiles.push(sourceReport);
    report.totalInvalidRows += sourceReport.invalidRows;
    report.totalDuplicatesRemoved += sourceReport.duplicatesRemoved;
    report.rankSuffixRows += sourceReport.rankSuffixRows;
    report.missingRankRows += sourceReport.missingOpeningRank + sourceReport.missingClosingRank;
    report.invalidRankRows += sourceReport.invalidOpeningRank + sourceReport.invalidClosingRank;
  }

  applyInstitutePreferenceRanks(rows);

  report.generatedAt = new Date().toISOString();
  report.totalValidRows = rows.length;
  report.seatTypes = Array.from(seatTypes).sort((a, b) => a.localeCompare(b));
  report.unknownSeatTypes = Array.from(baseSeatTypes)
    .filter((seatType) => !KNOWN_BASE_SEAT_TYPES.includes(seatType))
    .sort((a, b) => a.localeCompare(b));
  report.quotas = Array.from(quotas).sort((a, b) => a.localeCompare(b));
  report.uncommonQuotas = report.quotas.filter((quota) => !COMMON_QUOTAS.includes(quota));
  report.genders = Array.from(genders).sort((a, b) => a.localeCompare(b));
  report.instituteCount = institutes.size;
  report.programCount = programs.size;
  report.unclassifiedPrograms = Array.from(unclassifiedPrograms).sort((a, b) => a.localeCompare(b));
  report.unclassifiedProgramCount = report.unclassifiedPrograms.length;

  if (report.totalValidRows === 0) {
    report.validationNotes.push("No valid rows were generated. Check source workbook paths and headers.");
  }

  if (report.rankSuffixRows > 0) {
    report.validationNotes.push("Some ranks contain suffixes such as P. Numeric filtering uses the numeric component and the original display value is preserved.");
  }

  const dataDir = path.join(ROOT_DIR, "src", "data");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, "josaaCutoffs.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(dataDir, "dataQualityReport.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Generated ${rows.length} validated cutoff rows.`);
  console.log(`Removed ${report.totalDuplicatesRemoved} duplicate rows.`);
  console.log(`Unclassified programs: ${report.unclassifiedProgramCount}.`);
}

prepare().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
