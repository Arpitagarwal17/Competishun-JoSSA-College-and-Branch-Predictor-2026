"use client";

import { X } from "lucide-react";
import { COLLEGE_TYPES, getBranchDisplayName } from "@/lib/branchGroups";
import { getCourseDegreeLabel } from "@/lib/courseDegrees";
import { getQuotaLabel, getSeatTypeLabel } from "@/lib/displayLabels";
import { getHomeStateLabel } from "@/lib/homeStates";
import type { BranchGroupId, CollegeType, CourseDegree, CourseDuration, JosaaFilters } from "@/lib/types";

type Chip = {
  key: string;
  label: string;
  onRemove: () => void;
};

type Props = {
  filters: JosaaFilters;
  onFiltersChange: (filters: JosaaFilters) => void;
};

function getCourseDurationLabel(duration: CourseDuration) {
  return `${duration} Years`;
}

export function ActiveFilterChips({ filters, onFiltersChange }: Props) {
  const patch = (next: Partial<JosaaFilters>) => onFiltersChange({ ...filters, ...next });
  const chips: Chip[] = [];

  if (filters.collegeTypes.length > 0 && filters.collegeTypes.length < COLLEGE_TYPES.length) {
    for (const type of filters.collegeTypes) {
      chips.push({
        key: `type-${type}`,
        label: type,
        onRemove: () => patch({ collegeTypes: filters.collegeTypes.filter((item) => item !== type) as CollegeType[] })
      });
    }
  }

  if (filters.advancedRank) {
    chips.push({ key: "adv-rank", label: `Advanced ${filters.advancedRank}`, onRemove: () => patch({ advancedRank: null }) });
  }

  if (filters.mainRank) {
    chips.push({ key: "main-rank", label: `Main ${filters.mainRank}`, onRemove: () => patch({ mainRank: null }) });
  }

  for (const id of filters.branchGroupIds) {
    chips.push({
      key: `branch-${id}`,
      label: getBranchDisplayName(id),
      onRemove: () => patch({ branchGroupIds: filters.branchGroupIds.filter((item) => item !== id) as BranchGroupId[] })
    });
  }

  for (const duration of filters.courseDurations) {
    chips.push({
      key: `duration-${duration}`,
      label: getCourseDurationLabel(duration),
      onRemove: () => patch({ courseDurations: filters.courseDurations.filter((item) => item !== duration) as CourseDuration[] })
    });
  }

  for (const degree of filters.degreeTypes) {
    chips.push({
      key: `degree-${degree}`,
      label: getCourseDegreeLabel(degree),
      onRemove: () => patch({ degreeTypes: filters.degreeTypes.filter((item) => item !== degree) as CourseDegree[] })
    });
  }

  if (filters.homeState) {
    chips.push({
      key: "home-state",
      label: getHomeStateLabel(filters.homeState),
      onRemove: () => patch({ homeState: "" })
    });
  }

  for (const seatType of filters.seatTypes) {
    chips.push({
      key: `seat-${seatType}`,
      label: getSeatTypeLabel(seatType),
      onRemove: () => patch({ seatTypes: filters.seatTypes.filter((item) => item !== seatType) })
    });
  }

  for (const quota of filters.quotas) {
    chips.push({
      key: `quota-${quota}`,
      label: getQuotaLabel(quota),
      onRemove: () => patch({ quotas: filters.quotas.filter((item) => item !== quota) })
    });
  }

  for (const institute of filters.institutes) {
    chips.push({
      key: `institute-${institute}`,
      label: institute,
      onRemove: () => patch({ institutes: filters.institutes.filter((item) => item !== institute) })
    });
  }

  if (filters.programQuery.trim()) {
    chips.push({ key: "program", label: filters.programQuery.trim(), onRemove: () => patch({ programQuery: "" }) });
  }

  if (filters.includeRelatedBranches) {
    chips.push({ key: "related", label: "Related branches", onRemove: () => patch({ includeRelatedBranches: false }) });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-thin sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex max-w-[78vw] shrink-0 items-center gap-1.5 rounded-full border border-bluebrand/15 bg-bluebrand/5 px-2.5 py-1 text-[11px] font-bold text-bluebrand transition hover:border-orangebrand hover:bg-orangebrand/10 hover:text-orangebrand sm:max-w-full sm:px-3 sm:py-1.5 sm:text-xs"
          title={`Remove ${chip.label}`}
        >
          <span className="truncate">{chip.label}</span>
          <X aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
        </button>
      ))}
    </div>
  );
}
