import type { BranchGroup } from "./types";

export const BRANCH_GROUPS: BranchGroup[] = [
  {
    id: "cse",
    displayName: "Computer Science / IT",
    shortName: "CSE / IT",
    aliases: ["cse", "cs", "computer science", "computer engineering", "it", "software", "cyber"],
    exactKeywords: ["information technology"],
    includeKeywords: [
      "computer science",
      "computer engineering",
      "information technology",
      "software engineering",
      "computer science and engineering",
      "computer science and business systems",
      "computer science and design",
      "computer science and cloud computing",
      "computer science and cyber security",
      "computer science and data science",
      "computer science and artificial intelligence",
      "computer science and machine learning",
      "computational engineering"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["ai", "maths"]
  },
  {
    id: "ai",
    displayName: "Artificial Intelligence / Data Science",
    shortName: "AI / Data Science",
    aliases: ["ai", "aiml", "ai ml", "ml", "ds", "data science", "machine learning"],
    exactKeywords: ["artificial intelligence", "data science", "machine learning"],
    includeKeywords: [
      "artificial intelligence",
      "machine learning",
      "data science",
      "data engineering",
      "computational data science",
      "ai and ml",
      "ai and data",
      "robotics and ai",
      "computer science and artificial intelligence",
      "computer science and machine learning",
      "computer science and data science"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["cse", "maths"]
  },
  {
    id: "ece",
    displayName: "Electronics & Communication",
    shortName: "ECE",
    aliases: ["ece", "electronics communication", "electronics and communication", "vlsi", "microelectronics"],
    exactKeywords: ["electronics and communication engineering", "electronics engineering"],
    includeKeywords: [
      "electronics and communication",
      "electronics and communications",
      "electronics & communication",
      "electronics and telecommunication",
      "electronics engineering",
      "electronics and instrumentation",
      "electronics and electrical communication",
      "electronics and vlsi",
      "vlsi",
      "microelectronics",
      "communication engineering",
      "communication and signal processing",
      "signal processing",
      "electronics system",
      "electronic systems",
      "electronic engineering"
    ],
    excludeKeywords: ["electrical engineering", "electrical and electronics"],
    relatedGroupIds: ["electrical", "instrumentation"]
  },
  {
    id: "electrical",
    displayName: "Electrical / EEE",
    shortName: "Electrical",
    aliases: ["ee", "eee", "electrical", "power"],
    exactKeywords: ["electrical engineering"],
    includeKeywords: [
      "electrical engineering",
      "electrical and electronics",
      "electrical & electronics",
      "power engineering",
      "power systems",
      "electrical and computer engineering",
      "energy systems engineering"
    ],
    excludeKeywords: ["electronics and communication", "electronics and telecommunication"],
    relatedGroupIds: ["ece", "energy", "instrumentation"]
  },
  {
    id: "mechanical",
    displayName: "Mechanical / Production",
    shortName: "Mechanical",
    aliases: ["me", "mechanical", "mechatronics", "automobile", "thermal"],
    exactKeywords: ["mechanical engineering"],
    includeKeywords: [
      "mechanical engineering",
      "mechanical",
      "thermal engineering",
      "automobile engineering",
      "automotive engineering",
      "mechatronics",
      "robotics"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["production", "aerospace"]
  },
  {
    id: "civil",
    displayName: "Civil / Infrastructure",
    shortName: "Civil",
    aliases: ["civil", "construction", "structural", "infrastructure"],
    exactKeywords: ["civil engineering"],
    includeKeywords: [
      "civil engineering",
      "civil and infrastructure",
      "construction technology",
      "construction engineering",
      "structural engineering",
      "transportation engineering",
      "geotechnical engineering"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["environmental"]
  },
  {
    id: "chemical",
    displayName: "Chemical / Petroleum",
    shortName: "Chemical",
    aliases: ["chemical", "petroleum", "polymer", "petrochemical"],
    exactKeywords: ["chemical engineering"],
    includeKeywords: [
      "chemical engineering",
      "chemical technology",
      "petrochemical engineering",
      "petroleum engineering",
      "polymer engineering",
      "polymer science",
      "biochemical engineering",
      "oil technology"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["biotech"]
  },
  {
    id: "maths",
    displayName: "Mathematics & Computing",
    shortName: "Maths & Computing",
    aliases: ["mnc", "mn c", "math", "mathematics", "computing", "mathematics and computing"],
    exactKeywords: ["mathematics and computing"],
    includeKeywords: [
      "mathematics and computing",
      "mathematics & computing",
      "mathematics and scientific computing",
      "mathematics and data science",
      "computational mathematics",
      "statistical data science",
      "statistics and data science"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["cse", "ai"]
  },
  {
    id: "physics",
    displayName: "Engineering Physics",
    shortName: "Physics",
    aliases: ["engineering physics", "physics"],
    exactKeywords: ["engineering physics"],
    includeKeywords: ["engineering physics", "physics"],
    excludeKeywords: [],
    relatedGroupIds: []
  },
  {
    id: "architecture",
    displayName: "Architecture / Planning",
    shortName: "Architecture",
    aliases: ["architecture", "planning", "b arch", "barch"],
    exactKeywords: ["architecture", "planning"],
    includeKeywords: [
      "architecture",
      "planning",
      "urban planning",
      "town planning",
      "building engineering and construction management"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["civil"]
  },
  {
    id: "biotech",
    displayName: "Biotechnology / Biomedical",
    shortName: "Biotech",
    aliases: ["biotech", "biotechnology", "biomedical", "bioengineering", "life science"],
    exactKeywords: ["biotechnology", "biomedical engineering"],
    includeKeywords: [
      "biotechnology",
      "bio technology",
      "biomedical engineering",
      "bio engineering",
      "bioengineering",
      "biological sciences",
      "life science",
      "biosciences",
      "pharmaceutical"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["chemical", "food"]
  },
  {
    id: "metallurgy",
    displayName: "Metallurgy / Materials",
    shortName: "Materials",
    aliases: ["metallurgy", "materials", "material science", "ceramic"],
    exactKeywords: ["metallurgical engineering", "materials science"],
    includeKeywords: [
      "metallurgical",
      "metallurgy",
      "materials engineering",
      "material science",
      "materials science",
      "ceramic engineering",
      "ceramic",
      "mineral engineering"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["mining"]
  },
  {
    id: "mining",
    displayName: "Mining",
    shortName: "Mining",
    aliases: ["mining", "mineral"],
    exactKeywords: ["mining engineering"],
    includeKeywords: ["mining engineering", "mining machinery", "mineral engineering"],
    excludeKeywords: [],
    relatedGroupIds: ["metallurgy"]
  },
  {
    id: "aerospace",
    displayName: "Aerospace",
    shortName: "Aerospace",
    aliases: ["aerospace", "aeronautical", "aviation"],
    exactKeywords: ["aerospace engineering"],
    includeKeywords: ["aerospace engineering", "aeronautical engineering", "aviation"],
    excludeKeywords: [],
    relatedGroupIds: ["mechanical"]
  },
  {
    id: "production",
    displayName: "Production / Manufacturing",
    shortName: "Production",
    aliases: ["production", "manufacturing", "industrial", "smart manufacturing"],
    exactKeywords: ["production engineering", "manufacturing engineering"],
    includeKeywords: [
      "production engineering",
      "manufacturing engineering",
      "industrial engineering",
      "industrial and production",
      "smart manufacturing",
      "manufacturing science"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["mechanical"]
  },
  {
    id: "instrumentation",
    displayName: "Instrumentation / Control",
    shortName: "Instrumentation",
    aliases: ["instrumentation", "control", "instrumentation control"],
    exactKeywords: ["instrumentation engineering"],
    includeKeywords: [
      "instrumentation engineering",
      "instrumentation and control",
      "control engineering",
      "process control"
    ],
    excludeKeywords: [],
    relatedGroupIds: ["ece", "electrical"]
  },
  {
    id: "energy",
    displayName: "Energy / Power",
    shortName: "Energy",
    aliases: ["energy", "power", "renewable"],
    exactKeywords: ["energy engineering"],
    includeKeywords: ["energy engineering", "energy systems", "renewable energy", "power engineering"],
    excludeKeywords: [],
    relatedGroupIds: ["electrical", "chemical"]
  },
  {
    id: "environmental",
    displayName: "Environmental",
    shortName: "Environmental",
    aliases: ["environmental", "environment"],
    exactKeywords: ["environmental engineering"],
    includeKeywords: ["environmental engineering", "environmental science"],
    excludeKeywords: [],
    relatedGroupIds: ["civil", "chemical"]
  },
  {
    id: "textile",
    displayName: "Textile",
    shortName: "Textile",
    aliases: ["textile", "fibre", "fiber"],
    exactKeywords: ["textile technology"],
    includeKeywords: ["textile technology", "textile engineering", "fibre science", "fiber science"],
    excludeKeywords: [],
    relatedGroupIds: []
  },
  {
    id: "food",
    displayName: "Food / Agriculture",
    shortName: "Food / Agri",
    aliases: ["food", "agriculture", "agricultural"],
    exactKeywords: ["food technology", "agricultural engineering"],
    includeKeywords: ["food technology", "food engineering", "agricultural engineering", "dairy technology"],
    excludeKeywords: [],
    relatedGroupIds: ["biotech", "chemical"]
  },
  {
    id: "other",
    displayName: "Other / Unclassified",
    shortName: "Other",
    aliases: ["other", "unclassified"],
    exactKeywords: [],
    includeKeywords: [],
    excludeKeywords: [],
    relatedGroupIds: []
  }
];

export const COLLEGE_TYPE_PRIORITY = {
  IIT: 1,
  NIT: 2,
  IIIT: 3,
  GFTI: 4
} as const;

export const COLLEGE_TYPES = ["IIT", "NIT", "IIIT", "GFTI"] as const;

export function getBranchGroup(id: string) {
  return BRANCH_GROUPS.find((group) => group.id === id);
}

export function getBranchDisplayName(id: string) {
  return getBranchGroup(id)?.displayName ?? id;
}
