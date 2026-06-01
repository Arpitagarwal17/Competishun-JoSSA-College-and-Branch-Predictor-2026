"use client";

import type { JosaaFilters } from "@/lib/types";

type Props = {
  filters: JosaaFilters;
  onChange: (patch: Partial<JosaaFilters>) => void;
  compact?: boolean;
};

function toRank(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly.trim()) {
    return null;
  }

  const parsed = Number(digitsOnly);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : null;
}

export function RankInputs({ filters, onChange, compact = false }: Props) {
  const fields = [
    {
      label: "JEE Advanced Rank",
      value: filters.advancedRank ?? "",
      onChange: (value: string) => onChange({ advancedRank: toRank(value) })
    },
    {
      label: "JEE Main Rank",
      value: filters.mainRank ?? "",
      onChange: (value: string) => onChange({ mainRank: toRank(value) })
    }
  ];

  return (
    <div className={compact ? "contents" : "grid gap-3"}>
      {fields.map((field) => (
        <label
          key={field.label}
          className={
            compact
              ? "filter-card group flex min-h-12 flex-col justify-center px-3 py-2 md:min-h-14"
              : "grid gap-1.5 text-sm font-semibold text-ink"
          }
        >
          <span className={compact ? "block text-[10px] font-black uppercase tracking-wide text-muted md:text-[11px]" : ""}>{field.label}</span>
          <input
            className={
              compact
                ? "rank-field-input mt-0.5 w-full bg-transparent text-sm font-black tabular-nums text-ink outline-none placeholder:text-muted/60"
                : "control w-full px-3 text-sm font-semibold tabular-nums placeholder:text-muted/70"
            }
            inputMode="numeric"
            pattern="[0-9]*"
            type="text"
            autoComplete="off"
            aria-label={field.label}
            value={field.value}
            onChange={(event) => field.onChange(event.target.value)}
            placeholder="Enter rank"
          />
        </label>
      ))}
    </div>
  );
}
