import type { CourseDegree } from "./types";

export const COURSE_DEGREE_OPTIONS: Array<{ value: CourseDegree; label: string }> = [
  { value: "btech", label: "B.Tech" },
  { value: "btech-mtech", label: "B.Tech + M.Tech" },
  { value: "btech-mba", label: "B.Tech + MBA" },
  { value: "bs", label: "BS" },
  { value: "bs-dual", label: "BS + MS / MBA" },
  { value: "bsc", label: "B.Sc." },
  { value: "be", label: "B.E." },
  { value: "barch", label: "B.Arch" },
  { value: "bplan", label: "B.Plan" },
  { value: "bdes", label: "B.Des" },
  { value: "other", label: "Other" }
];

export function getCourseDegreeLabel(degree: CourseDegree) {
  return COURSE_DEGREE_OPTIONS.find((option) => option.value === degree)?.label ?? degree;
}

export function getCourseDegree(program: string): CourseDegree {
  const normalized = program.toLowerCase();
  const compact = normalized.replace(/[\s.]+/g, "");

  if (normalized.includes("bachelor of technology and mba") || (compact.includes("btech") && normalized.includes("mba"))) {
    return "btech-mba";
  }

  if (
    normalized.includes("bachelor and master of technology") ||
    normalized.includes("b.tech. + m.tech") ||
    normalized.includes("b.tech + m.tech") ||
    compact.includes("btech+mtech") ||
    compact.includes("btechmtech")
  ) {
    return "btech-mtech";
  }

  if (normalized.includes("bachelor of science and master of science") || (normalized.includes("bs in") && normalized.includes("mba"))) {
    return "bs-dual";
  }

  if (/\bbs\b/i.test(program) || normalized.startsWith("bs in ")) {
    return "bs";
  }

  if (normalized.includes("bachelor of science")) {
    return "bsc";
  }

  if (normalized.includes("bachelor of engineering")) {
    return "be";
  }

  if (normalized.includes("bachelor of architecture")) {
    return "barch";
  }

  if (normalized.includes("bachelor of planning")) {
    return "bplan";
  }

  if (normalized.includes("bachelor of design")) {
    return "bdes";
  }

  if (normalized.includes("bachelor of technology") || compact.includes("btech")) {
    return "btech";
  }

  return "other";
}
