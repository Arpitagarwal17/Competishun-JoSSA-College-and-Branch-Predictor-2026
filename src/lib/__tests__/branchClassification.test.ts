import { describe, expect, it } from "vitest";
import { classifyBranch, findBranchGroupsForSearch } from "../classifyBranch";

describe("branch classification", () => {
  it("includes electronics and communication variants under ECE", () => {
    const programs = [
      "Electronics and Communication Engineering",
      "Electronics and Telecommunication Engineering",
      "Electronics and Instrumentation Engineering",
      "VLSI Design and Technology",
      "Microelectronics"
    ];

    for (const program of programs) {
      expect(classifyBranch(program).branchGroups, program).toContain("ece");
    }
  });

  it("does not include pure Electrical Engineering under ECE", () => {
    const classification = classifyBranch("Electrical Engineering");
    expect(classification.branchGroups).toContain("electrical");
    expect(classification.branchGroups).not.toContain("ece");
  });

  it("includes Computer Science / CSE variants", () => {
    const programs = [
      "Computer Science and Engineering",
      "Computer Science and Artificial Intelligence",
      "Computer Science and Data Science",
      "Computer Science and Cloud Computing",
      "Information Technology"
    ];

    for (const program of programs) {
      expect(classifyBranch(program).branchGroups, program).toContain("cse");
    }
  });

  it("includes Artificial Intelligence / ML / Data Science variants", () => {
    const programs = [
      "Artificial Intelligence",
      "AI and ML",
      "Artificial Intelligence and Data Science",
      "Data Science",
      "Computer Science and Artificial Intelligence"
    ];

    for (const program of programs) {
      expect(classifyBranch(program).branchGroups, program).toContain("ai");
    }
  });

  it("supports abbreviation search", () => {
    expect(findBranchGroupsForSearch("ECE").map((group) => group.id)).toContain("ece");
    expect(findBranchGroupsForSearch("CSE").map((group) => group.id)).toContain("cse");
    expect(findBranchGroupsForSearch("AIML").map((group) => group.id)).toContain("ai");
    expect(findBranchGroupsForSearch("MnC").map((group) => group.id)).toContain("maths");
  });

  it("keeps unmatched programs under Other / Unclassified", () => {
    const classification = classifyBranch("Experimental Design Studies");
    expect(classification.branchGroups).toEqual(["other"]);
    expect(classification.primaryBranchGroup).toBe("other");
  });
});
