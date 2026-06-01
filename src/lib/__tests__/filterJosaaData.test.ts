import { describe, expect, it } from "vitest";
import { createDefaultFilters, filterJosaaData } from "../filterJosaaData";
import { makeRow } from "./fixtures";

describe("filterJosaaData", () => {
  it("selecting IIT + IIIT shows only IIT and IIIT rows", () => {
    const rows = [
      makeRow({ collegeType: "IIT", institute: "IIT Test" }),
      makeRow({ collegeType: "NIT", institute: "NIT Test" }),
      makeRow({ collegeType: "IIIT", institute: "IIIT Test" }),
      makeRow({ collegeType: "GFTI", institute: "GFTI Test" })
    ];
    const filters = { ...createDefaultFilters(), collegeTypes: ["IIT", "IIIT"], advancedRank: 1, mainRank: 1 };
    const results = filterJosaaData(rows, filters);

    expect(results.map((row) => row.collegeType)).toEqual(["IIT", "IIIT"]);
  });

  it("sorts results by IIT, NIT, IIIT, GFTI priority", () => {
    const rows = [
      makeRow({ collegeType: "GFTI", closingRank: 10 }),
      makeRow({ collegeType: "IIIT", closingRank: 10 }),
      makeRow({ collegeType: "NIT", closingRank: 10 }),
      makeRow({ collegeType: "IIT", closingRank: 10 })
    ];
    const filters = { ...createDefaultFilters(), advancedRank: 1, mainRank: 1 };
    const results = filterJosaaData(rows, filters);

    expect(results.map((row) => row.collegeType)).toEqual(["IIT", "NIT", "IIIT", "GFTI"]);
  });

  it("sorts colleges by CSE preference rank inside each college type", () => {
    const rows = [
      makeRow({ collegeType: "IIT", institute: "Lower Preference IIT", institutePreferenceRank: 500 }),
      makeRow({ collegeType: "IIT", institute: "Higher Preference IIT", institutePreferenceRank: 10 })
    ];
    const filters = { ...createDefaultFilters(), advancedRank: 1 };
    const results = filterJosaaData(rows, filters);

    expect(results.map((row) => row.institute)).toEqual(["Higher Preference IIT", "Lower Preference IIT"]);
  });

  it("orders gender-neutral rows before female-only rows for the same cutoff group", () => {
    const rows = [
      makeRow({ gender: "Female-only (including Supernumerary)", openingRank: 100, closingRank: 1000 }),
      makeRow({ gender: "Gender-Neutral", openingRank: 100, closingRank: 1000 })
    ];
    const filters = { ...createDefaultFilters(), genderMode: "female", mainRank: 1 };
    const results = filterJosaaData(rows, filters);

    expect(results.map((row) => row.gender)).toEqual(["Gender-Neutral", "Female-only (including Supernumerary)"]);
  });

  it("uses Closing Rank for prediction eligibility", () => {
    const rows = [makeRow({ collegeType: "NIT", openingRank: 100, closingRank: 1000 })];
    const filters = { ...createDefaultFilters(), mainRank: 900 };
    const results = filterJosaaData(rows, filters);

    expect(results).toHaveLength(1);
    expect(results[0].predictionStatus).toBe("Eligible");
  });

  it("automatically shows only colleges within entered rank", () => {
    const rows = [
      makeRow({ collegeType: "NIT", institute: "Within Rank NIT", closingRank: 6000 }),
      makeRow({ collegeType: "NIT", institute: "Outside Rank NIT", closingRank: 4000 })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), mainRank: 5000 });

    expect(results).toHaveLength(1);
    expect(results[0].institute).toBe("Within Rank NIT");
  });

  it("eligible-only mode uses JEE Advanced rank for IIT rows", () => {
    const rows = [makeRow({ collegeType: "IIT", closingRank: 1000 })];
    const eligibleOnly = { ...createDefaultFilters(), showAllCutoffs: false, showOnlyPossible: true };
    const withMainOnly = filterJosaaData(rows, { ...eligibleOnly, mainRank: 1 });
    const withAdvanced = filterJosaaData(rows, { ...eligibleOnly, advancedRank: 900 });

    expect(withMainOnly).toHaveLength(0);
    expect(withAdvanced).toHaveLength(1);
  });

  it("does not hide browse results when eligible-only is set before any rank is entered", () => {
    const rows = [makeRow({ collegeType: "NIT" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), showAllCutoffs: false, showOnlyPossible: true });

    expect(results).toHaveLength(1);
    expect(results[0].predictionStatus).toBe("Rank required");
  });

  it("shows selected ECE cutoffs across college types before ranks are entered", () => {
    const rows = [
      makeRow({ collegeType: "GFTI", institute: "GFTI ECE", program: "Electronics and Communication Engineering" }),
      makeRow({ collegeType: "IIIT", institute: "IIIT ECE", program: "Electronics and Communication Engineering" }),
      makeRow({ collegeType: "NIT", institute: "NIT ECE", program: "Electronics and Communication Engineering" }),
      makeRow({ collegeType: "IIT", institute: "IIT ECE", program: "Electronics and Communication Engineering" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), branchGroupIds: ["ece"] });

    expect(results.map((row) => row.collegeType)).toEqual(["IIT", "NIT", "IIIT", "GFTI"]);
    expect(results.every((row) => row.predictionStatus === "Rank required")).toBe(true);
  });

  it("uses entered rank type to hide colleges that need the other exam", () => {
    const rows = [
      makeRow({ collegeType: "IIT", institute: "IIT Rank Scope" }),
      makeRow({ collegeType: "NIT", institute: "NIT Rank Scope" }),
      makeRow({ collegeType: "IIIT", institute: "IIIT Rank Scope" }),
      makeRow({ collegeType: "GFTI", institute: "GFTI Rank Scope" })
    ];

    const browseAll = filterJosaaData(rows, createDefaultFilters());
    const mainOnly = filterJosaaData(rows, { ...createDefaultFilters(), mainRank: 100 });
    const advancedOnly = filterJosaaData(rows, { ...createDefaultFilters(), advancedRank: 100 });
    const bothRanks = filterJosaaData(rows, { ...createDefaultFilters(), advancedRank: 100, mainRank: 100 });

    expect(browseAll.map((row) => row.collegeType)).toEqual(["IIT", "NIT", "IIIT", "GFTI"]);
    expect(mainOnly.map((row) => row.collegeType)).toEqual(["NIT", "IIIT", "GFTI"]);
    expect(advancedOnly.map((row) => row.collegeType)).toEqual(["IIT"]);
    expect(bothRanks.map((row) => row.collegeType)).toEqual(["IIT", "NIT", "IIIT", "GFTI"]);
  });

  it("uses JEE Main rank for NIT, IIIT, and GFTI rows", () => {
    const rows = [
      makeRow({ collegeType: "NIT", closingRank: 1000 }),
      makeRow({ collegeType: "IIIT", closingRank: 1000 }),
      makeRow({ collegeType: "GFTI", closingRank: 1000 })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), mainRank: 900 });

    expect(results.map((row) => row.collegeType)).toEqual(["NIT", "IIIT", "GFTI"]);
  });

  it("female candidate includes Gender-Neutral and Female-only rows", () => {
    const rows = [
      makeRow({ gender: "Gender-Neutral" }),
      makeRow({ gender: "Female-only (including Supernumerary)" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), genderMode: "female", mainRank: 1 });

    expect(results).toHaveLength(2);
  });

  it("non-female candidate excludes Female-only rows", () => {
    const rows = [
      makeRow({ gender: "Gender-Neutral" }),
      makeRow({ gender: "Female-only (including Supernumerary)" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), genderMode: "male-other", mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].gender).toBe("Gender-Neutral");
  });

  it("keeps PwD and non-PwD seat types separate", () => {
    const rows = [makeRow({ seatType: "OPEN" }), makeRow({ seatType: "OPEN (PwD)" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), seatTypes: ["OPEN"], mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].seatType).toBe("OPEN");
  });

  it("filters 4-year and 5-year course durations from program names", () => {
    const rows = [
      makeRow({ program: "Computer Science and Engineering (4 Years, Bachelor of Technology)" }),
      makeRow({ program: "Electrical Engineering (5 Years, Bachelor and Master of Technology (Dual Degree))" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), courseDurations: ["5"], mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].program).toContain("5 Years");
  });

  it("filters degree type from program names", () => {
    const rows = [
      makeRow({ program: "Computer Science and Engineering (4 Years, Bachelor of Technology)" }),
      makeRow({ program: "Electrical Engineering (5 Years, Bachelor and Master of Technology (Dual Degree))" }),
      makeRow({ program: "BS in Mathematics (4 Years, Bachelor of Science)" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), degreeTypes: ["btech-mtech"], mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].program).toContain("Bachelor and Master of Technology");
  });

  it("filters quota correctly", () => {
    const rows = [makeRow({ quota: "AI" }), makeRow({ quota: "HS" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), quotas: ["HS"], homeState: "Rajasthan", mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].quota).toBe("HS");
  });

  it("keeps all quota rows visible when no home state is selected", () => {
    const rows = [makeRow({ quota: "AI" }), makeRow({ quota: "HS" }), makeRow({ quota: "OS" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), mainRank: 1 });

    expect(results.map((row) => row.quota).sort()).toEqual(["AI", "HS", "OS"]);
  });

  it("uses selected home state to choose HS and OS quota rows", () => {
    const rows = [
      makeRow({ institute: "Malaviya National Institute of Technology Jaipur", quota: "HS" }),
      makeRow({ institute: "National Institute of Technology Patna", quota: "HS" }),
      makeRow({ institute: "National Institute of Technology Patna", quota: "OS" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), homeState: "Rajasthan", mainRank: 1 });

    expect(results.map((row) => `${row.institute}:${row.quota}`)).toEqual([
      "Malaviya National Institute of Technology Jaipur:HS",
      "National Institute of Technology Patna:OS"
    ]);
  });

  it("keeps special Goa quota under the Goa home state", () => {
    const rows = [
      makeRow({ institute: "National Institute of Technology Goa", quota: "GO" }),
      makeRow({ institute: "National Institute of Technology Goa", quota: "JK" })
    ];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), homeState: "Goa", mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].quota).toBe("GO");
  });

  it("filters exact institute selections", () => {
    const rows = [makeRow({ institute: "Institute Alpha" }), makeRow({ institute: "Institute Beta" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), institutes: ["Institute Beta"], mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].institute).toBe("Institute Beta");
  });

  it("includes related branches only when enabled", () => {
    const rows = [makeRow({ program: "Electrical Engineering" })];
    const strictResults = filterJosaaData(rows, { ...createDefaultFilters(), branchGroupIds: ["ece"], mainRank: 1 });
    const relatedResults = filterJosaaData(rows, {
      ...createDefaultFilters(),
      branchGroupIds: ["ece"],
      includeRelatedBranches: true,
      mainRank: 1
    });

    expect(strictResults).toHaveLength(0);
    expect(relatedResults).toHaveLength(1);
  });

  it("does not crash with empty filters", () => {
    const results = filterJosaaData([], createDefaultFilters());
    expect(results).toEqual([]);
  });

  it("reset filters restores default state", () => {
    expect(createDefaultFilters()).toMatchObject({
      branchGroupIds: [],
      courseDurations: [],
      degreeTypes: [],
      homeState: "",
      collegeTypes: [],
      showOnlyPossible: false,
      showBorderline: false,
      showAllCutoffs: true
    });
  });

  it("unclassified programs remain visible under Other / Unclassified", () => {
    const rows = [makeRow({ program: "Experimental Design Studies" })];
    const results = filterJosaaData(rows, { ...createDefaultFilters(), branchGroupIds: ["other"], mainRank: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].primaryBranchGroup).toBe("other");
  });
});
