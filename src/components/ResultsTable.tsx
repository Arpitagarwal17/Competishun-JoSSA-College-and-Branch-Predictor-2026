"use client";

import { Check, Plus } from "lucide-react";
import { useEffect, useRef } from "react";
import { getBranchDisplayName } from "@/lib/branchGroups";
import { getGenderLabel, getQuotaLabel, getSeatTypeLabel } from "@/lib/displayLabels";
import type { FilteredCutoffRow } from "@/lib/types";

type Props = {
  onTogglePreference: (row: FilteredCutoffRow) => void;
  preferenceIds: Set<string>;
  rows: FilteredCutoffRow[];
  scrollResetKey: number;
};

export function ResultsTable({ onTogglePreference, preferenceIds, rows, scrollResetKey }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [scrollResetKey]);

  return (
    <div className="desktop-table overflow-hidden rounded-2xl border border-bluebrand/15 bg-panel shadow-[0_18px_45px_rgba(7,0,159,0.10)]">
      <div ref={scrollRef} className="max-h-[calc(100vh-128px)] overflow-auto scrollbar-thin">
        <table className="min-w-[1240px] table-fixed border-collapse text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-bluebrand to-bluebrand-dark text-xs uppercase tracking-wide text-white shadow-sm">
            <tr>
              <th className="sticky left-0 z-30 w-28 border-b border-bluebrand-dark/20 bg-bluebrand px-3 py-3 text-center">Choice</th>
              <th className="w-72 border-b border-bluebrand-dark/20 bg-bluebrand px-4 py-3">Institute</th>
              <th className="w-[328px] border-b border-bluebrand-dark/20 px-4 py-3">Program</th>
              <th className="w-40 border-b border-white/10 px-4 py-3">Branch</th>
              <th className="w-32 border-b border-white/10 px-4 py-3">Quota</th>
              <th className="w-48 border-b border-white/10 px-4 py-3">Category</th>
              <th className="w-36 border-b border-white/10 px-4 py-3">Gender</th>
              <th className="w-28 border-b border-white/10 px-4 py-3 text-right">Opening</th>
              <th className="w-28 border-b border-white/10 px-4 py-3 text-right">Closing</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="group border-b border-line/75 bg-white transition-colors last:border-b-0 even:bg-panel-strong/55 hover:bg-orangebrand/5">
                <td className="sticky left-0 z-[3] bg-white px-3 py-3 shadow-[8px_0_18px_rgba(7,0,159,0.05)] group-even:bg-panel-strong group-hover:bg-orangebrand/5">
                  <button
                    type="button"
                    onClick={() => onTogglePreference(row)}
                    aria-pressed={preferenceIds.has(row.id)}
                    className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-black transition ${
                      preferenceIds.has(row.id)
                        ? "border-bluebrand/20 bg-bluebrand text-white shadow-sm"
                        : "border-orangebrand/25 bg-orangebrand/10 text-orangebrand hover:bg-orangebrand hover:text-white"
                    }`}
                  >
                    {preferenceIds.has(row.id) ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Plus aria-hidden className="h-3.5 w-3.5" />}
                    {preferenceIds.has(row.id) ? "Added" : "Add"}
                  </button>
                </td>
                <td className="bg-white px-4 py-3 group-even:bg-panel-strong group-hover:bg-orangebrand/5">
                  <div className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5 rounded-full border border-bluebrand/20 bg-bluebrand/10 px-2.5 py-1 text-xs font-black text-bluebrand">
                      {row.collegeType}
                    </span>
                    <span className="font-black leading-snug text-ink">{row.institute}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold leading-snug text-ink">{row.program}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-muted">{getBranchDisplayName(row.primaryBranchGroup)}</td>
                <td className="px-4 py-3 font-semibold">{getQuotaLabel(row.quota)}</td>
                <td className="px-4 py-3">{getSeatTypeLabel(row.seatType)}</td>
                <td className="px-4 py-3">{getGenderLabel(row.gender)}</td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex min-w-16 justify-center rounded-full bg-bluebrand/10 px-3 py-1 font-black tabular-nums text-bluebrand">
                    {row.openingRank.toLocaleString("en-IN")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex min-w-16 justify-center rounded-full bg-orangebrand/10 px-3 py-1 font-black tabular-nums text-orangebrand">
                    {row.closingRank.toLocaleString("en-IN")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
