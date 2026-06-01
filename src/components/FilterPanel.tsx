"use client";

import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";
import { BRANCH_GROUPS, COLLEGE_TYPES, COLLEGE_TYPE_PRIORITY } from "@/lib/branchGroups";
import { COURSE_DEGREE_OPTIONS, getCourseDegree } from "@/lib/courseDegrees";
import { getSeatTypeLabel, seatTypePriority } from "@/lib/displayLabels";
import { HOME_STATE_OPTIONS } from "@/lib/homeStates";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import type { BranchGroupId, CollegeType, CourseDegree, CourseDuration, CutoffRow, FilterOptions, JosaaFilters } from "@/lib/types";

type Props = {
  filters: JosaaFilters;
  onFiltersChange: (filters: JosaaFilters) => void;
  options: FilterOptions;
  rows: CutoffRow[];
  onReset: () => void;
  onClose?: () => void;
  onApply?: () => void;
  variant?: "sidebar" | "top";
};

type VisibleGenderMode = Exclude<JosaaFilters["genderMode"], "manual">;

const GENDER_MODE_OPTIONS: Array<{ value: VisibleGenderMode; label: string }> = [
  { value: "male-other", label: "Gender-Neutral" },
  { value: "female", label: "Female candidate" },
  { value: "all", label: "All gender rows" }
];

const COURSE_DURATION_OPTIONS: Array<{ value: CourseDuration; label: string }> = [
  { value: "4", label: "4 Years" },
  { value: "5", label: "5 Years" }
];

const BRANCH_DISPLAY_ORDER: BranchGroupId[] = [
  "cse",
  "ai",
  "maths",
  "ece",
  "electrical",
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

function collegeTypeGroup(type: CollegeType) {
  if (type === "IIT") {
    return "IITs";
  }
  if (type === "NIT") {
    return "NITs";
  }
  if (type === "IIIT") {
    return "IIITs";
  }
  return "GFTIs";
}

const MISSING_PREFERENCE = 999_999_999;

function GenderSelect({
  filters,
  patch,
  popupMode
}: {
  filters: JosaaFilters;
  patch: (next: Partial<JosaaFilters>) => void;
  popupMode: "flow" | "overlay";
}) {
  const value: VisibleGenderMode = filters.genderMode === "manual" ? "all" : filters.genderMode;

  return (
    <MultiSelectDropdown
      label="Gender"
      options={GENDER_MODE_OPTIONS}
      selectedValues={[value]}
      onChange={(genderModes) =>
        patch({
          genderMode: (genderModes.at(-1) as VisibleGenderMode | undefined) ?? value,
          manualGenders: []
        })
      }
      placeholder="Gender-Neutral"
      popupMode={popupMode}
      selectionMode="single"
      allowClear={false}
    />
  );
}

export function FilterPanel({ filters, onFiltersChange, options, rows, onReset, onClose, onApply, variant = "sidebar" }: Props) {
  const patch = (next: Partial<JosaaFilters>) => onFiltersChange({ ...filters, ...next });
  const dropdownMode = variant === "top" ? "overlay" : "flow";

  const branchOptions = useMemo(
    () =>
      BRANCH_DISPLAY_ORDER.map((id) => BRANCH_GROUPS.find((group) => group.id === id))
        .filter((group): group is (typeof BRANCH_GROUPS)[number] => Boolean(group))
        .map((group) => ({
          value: group.id,
          label: group.displayName,
          helper: group.shortName
        })),
    []
  );

  const collegeTypeOptions = useMemo(
    () => COLLEGE_TYPES.map((type) => ({ value: type, label: type })),
    []
  );
  const categoryOptions = useMemo(
    () =>
      options.seatTypes
        .map((seatType) => ({ value: seatType, label: getSeatTypeLabel(seatType) }))
        .sort((a, b) => seatTypePriority(a.value) - seatTypePriority(b.value) || a.label.localeCompare(b.label)),
    [options.seatTypes]
  );
  const homeStateOptions = useMemo(() => HOME_STATE_OPTIONS.map((option) => ({ ...option })), []);
  const degreeOptions = useMemo(() => {
    const availableDegrees = new Set(rows.map((row) => getCourseDegree(row.program)));
    return COURSE_DEGREE_OPTIONS.filter((option) => availableDegrees.has(option.value));
  }, [rows]);
  const instituteMeta = useMemo(() => {
    const byInstitute = new Map<string, { collegeType: CollegeType; preferenceRank: number }>();

    for (const row of rows) {
      const existing = byInstitute.get(row.institute);
      const preferenceRank = row.institutePreferenceRank ?? MISSING_PREFERENCE;

      if (
        !existing ||
        COLLEGE_TYPE_PRIORITY[row.collegeType] < COLLEGE_TYPE_PRIORITY[existing.collegeType] ||
        preferenceRank < existing.preferenceRank
      ) {
        byInstitute.set(row.institute, { collegeType: row.collegeType, preferenceRank });
      }
    }

    return byInstitute;
  }, [rows]);
  const instituteOptions = useMemo(() => {
    const activeCollegeTypes = new Set(filters.collegeTypes.length ? filters.collegeTypes : COLLEGE_TYPES);

    return Array.from(instituteMeta.entries())
      .filter(([, meta]) => activeCollegeTypes.has(meta.collegeType))
      .sort(([nameA, metaA], [nameB, metaB]) => {
        const priorityDelta = COLLEGE_TYPE_PRIORITY[metaA.collegeType] - COLLEGE_TYPE_PRIORITY[metaB.collegeType];
        const preferenceDelta = metaA.preferenceRank - metaB.preferenceRank;
        return priorityDelta || preferenceDelta || nameA.localeCompare(nameB);
      })
      .map(([institute, meta]) => ({
        value: institute,
        label: institute,
        helper: meta.collegeType,
        group: collegeTypeGroup(meta.collegeType)
      }));
  }, [filters.collegeTypes, instituteMeta]);
  const handleCollegeTypesChange = (collegeTypes: CollegeType[]) => {
    const activeCollegeTypes = new Set(collegeTypes.length ? collegeTypes : COLLEGE_TYPES);
    const institutes = filters.institutes.filter((institute) => {
      const meta = instituteMeta.get(institute);
      return meta ? activeCollegeTypes.has(meta.collegeType) : true;
    });

    patch({ collegeTypes, institutes });
  };

  if (variant === "top") {
    return (
      <section className="relative z-30 overflow-visible rounded-2xl border border-bluebrand/15 bg-white/95 shadow-[0_18px_42px_rgba(7,0,159,0.11)] backdrop-blur lg:sticky lg:top-3">
        <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-bluebrand/15 bg-gradient-to-r from-bluebrand to-bluebrand-dark px-4 py-2.5 text-white">
          <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide">
            <SlidersHorizontal aria-hidden className="h-4 w-4" />
            Filters
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-orangebrand px-3 text-xs font-black text-white shadow-sm transition hover:bg-orangebrand-dark focus-visible:outline-white"
            aria-label="Reset all filters"
          >
            <RotateCcw aria-hidden className="h-4 w-4" />
            Reset
          </button>
        </div>

        <div className="grid gap-2.5 overflow-visible rounded-b-2xl bg-panel-strong/75 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:gap-3">
          <div>
            <MultiSelectDropdown
              label="College Type"
              options={collegeTypeOptions}
              selectedValues={filters.collegeTypes}
              onChange={(collegeTypes) => handleCollegeTypesChange(collegeTypes as CollegeType[])}
              placeholder="All types"
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="College"
              options={instituteOptions}
              selectedValues={filters.institutes}
              onChange={(institutes) => patch({ institutes })}
              placeholder="All colleges"
              searchable
              maxVisible={2000}
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Branch"
              options={branchOptions}
              selectedValues={filters.branchGroupIds}
              onChange={(branchGroupIds) =>
                patch({
                  branchGroupIds: branchGroupIds as BranchGroupId[]
                })
              }
              placeholder="All branches"
              searchable
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Degree"
              options={degreeOptions}
              selectedValues={filters.degreeTypes}
              onChange={(degreeTypes) => patch({ degreeTypes: degreeTypes as CourseDegree[] })}
              placeholder="All degrees"
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Course Duration"
              options={COURSE_DURATION_OPTIONS}
              selectedValues={filters.courseDurations}
              onChange={(courseDurations) => patch({ courseDurations: courseDurations as CourseDuration[] })}
              placeholder="4 Years + 5 Years"
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <MultiSelectDropdown
              label="Category"
              options={categoryOptions}
              selectedValues={filters.seatTypes}
              onChange={(seatTypes) => patch({ seatTypes })}
              placeholder="All categories"
              popupMode={dropdownMode}
            />
          </div>

          <div>
            <GenderSelect filters={filters} patch={patch} popupMode={dropdownMode} />
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <MultiSelectDropdown
              label="Home State"
              options={homeStateOptions}
              selectedValues={filters.homeState ? [filters.homeState] : []}
              onChange={(homeStates) => patch({ homeState: homeStates.at(-1) ?? "" })}
              placeholder="All states"
              searchable
              popupMode={dropdownMode}
              selectionMode="single"
            />
          </div>

        </div>
      </section>
    );
  }

  return (
    <div className="flex h-full flex-col bg-panel">
      <div className="flex items-center justify-between border-b border-bluebrand/20 bg-gradient-to-r from-bluebrand to-bluebrand-dark px-4 py-3 text-white">
        <div>
          <div className="inline-flex items-center gap-2 text-lg font-black">
            <SlidersHorizontal aria-hidden className="h-5 w-5" />
            Filters
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close filters"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-3 overflow-auto bg-panel-strong/70 px-3 py-3 scrollbar-thin sm:px-4 sm:py-4">
        <div>
          <MultiSelectDropdown
            label="College Type"
            options={collegeTypeOptions}
            selectedValues={filters.collegeTypes}
            onChange={(collegeTypes) => handleCollegeTypesChange(collegeTypes as CollegeType[])}
            placeholder="All types"
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="College"
            options={instituteOptions}
            selectedValues={filters.institutes}
            onChange={(institutes) => patch({ institutes })}
            placeholder="All colleges"
            searchable
            maxVisible={2000}
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Branch"
            options={branchOptions}
            selectedValues={filters.branchGroupIds}
            onChange={(branchGroupIds) =>
              patch({
                branchGroupIds: branchGroupIds as BranchGroupId[]
              })
            }
            placeholder="All branches"
            searchable
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Degree"
            options={degreeOptions}
            selectedValues={filters.degreeTypes}
            onChange={(degreeTypes) => patch({ degreeTypes: degreeTypes as CourseDegree[] })}
            placeholder="All degrees"
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Course Duration"
            options={COURSE_DURATION_OPTIONS}
            selectedValues={filters.courseDurations}
            onChange={(courseDurations) => patch({ courseDurations: courseDurations as CourseDuration[] })}
            placeholder="4 Years + 5 Years"
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <MultiSelectDropdown
            label="Category"
            options={categoryOptions}
            selectedValues={filters.seatTypes}
            onChange={(seatTypes) => patch({ seatTypes })}
            placeholder="All categories"
            popupMode={dropdownMode}
          />
        </div>

        <div>
          <GenderSelect filters={filters} patch={patch} popupMode={dropdownMode} />
        </div>

        <div>
          <MultiSelectDropdown
            label="Home State"
            options={homeStateOptions}
            selectedValues={filters.homeState ? [filters.homeState] : []}
            onChange={(homeStates) => patch({ homeState: homeStates.at(-1) ?? "" })}
            placeholder="All states"
            searchable
            popupMode={dropdownMode}
            selectionMode="single"
          />
        </div>
      </div>

      <div className="grid gap-2 border-t border-line bg-white/92 p-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-orangebrand/25 bg-orangebrand/10 px-4 text-sm font-black text-orangebrand transition hover:bg-orangebrand hover:text-white"
          aria-label="Reset all filters"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Reset
        </button>
        <button
          type="button"
          onClick={onApply ?? onClose}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-bluebrand px-4 text-sm font-black text-white shadow-[0_12px_24px_rgba(7,0,159,0.18)] transition hover:bg-bluebrand-dark"
        >
          Show Results
        </button>
      </div>
    </div>
  );
}
