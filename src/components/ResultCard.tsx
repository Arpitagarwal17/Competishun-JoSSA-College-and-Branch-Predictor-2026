"use client";

import { Check, Plus } from "lucide-react";
import { getGenderLabel, getQuotaLabel, getSeatTypeLabel } from "@/lib/displayLabels";
import type { FilteredCutoffRow } from "@/lib/types";

type Props = {
  onTogglePreference: (row: FilteredCutoffRow) => void;
  row: FilteredCutoffRow;
  selected: boolean;
};

export function ResultCard({ onTogglePreference, row, selected }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-bluebrand/15 bg-white shadow-[0_12px_28px_rgba(7,0,159,0.08)]">
      <div className="border-b border-bluebrand/10 bg-[linear-gradient(115deg,rgba(7,0,159,0.06),rgba(255,91,0,0.055))] p-3">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex shrink-0 rounded-full border border-bluebrand/20 bg-bluebrand/10 px-2 py-0.5 text-[11px] font-black uppercase tracking-wide text-bluebrand">
                {row.collegeType}
              </span>
              <h2 className="line-clamp-2 text-sm font-black leading-snug text-ink">{row.institute}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onTogglePreference(row)}
            aria-pressed={selected}
            className={`inline-flex min-h-9 shrink-0 items-center gap-1 rounded-xl border px-2.5 text-[11px] font-black shadow-sm transition ${
              selected
                ? "border-bluebrand/20 bg-bluebrand text-white"
                : "border-orangebrand/25 bg-white text-orangebrand hover:bg-orangebrand hover:text-white"
            }`}
          >
            {selected ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Plus aria-hidden className="h-3.5 w-3.5" />}
            {selected ? "Added" : "Add"}
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="line-clamp-2 text-xs font-black leading-snug text-ink sm:text-sm">{row.program}</div>

        <dl className="mt-2.5 flex gap-1.5 text-xs">
          <div className="min-w-0 flex-1 rounded-xl border border-bluebrand/10 bg-bluebrand/5 px-2.5 py-1.5">
            <dt className="text-[10px] font-black uppercase tracking-wide text-muted">Opening</dt>
            <dd className="text-sm font-black tabular-nums text-bluebrand">{row.openingRank.toLocaleString("en-IN")}</dd>
          </div>
          <div className="min-w-0 flex-1 rounded-xl border border-orangebrand/15 bg-orangebrand/10 px-2.5 py-1.5">
            <dt className="text-[10px] font-black uppercase tracking-wide text-orangebrand">Closing</dt>
            <dd className="text-sm font-black tabular-nums text-orangebrand">{row.closingRank.toLocaleString("en-IN")}</dd>
          </div>
        </dl>

        <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold text-ink">
          <span className="rounded-lg bg-slatepanel px-2 py-1">{getQuotaLabel(row.quota)}</span>
          <span className="rounded-lg bg-slatepanel px-2 py-1">{getSeatTypeLabel(row.seatType)}</span>
          <span className="rounded-lg bg-slatepanel px-2 py-1">{getGenderLabel(row.gender)}</span>
        </div>
      </div>
    </article>
  );
}
