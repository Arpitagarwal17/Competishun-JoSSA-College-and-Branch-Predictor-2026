"use client";

import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type DropdownOption = {
  value: string;
  label: string;
  helper?: string;
  group?: string;
};

type Props = {
  label: string;
  options: DropdownOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  maxVisible?: number;
  popupMode?: "flow" | "overlay";
  selectionMode?: "multiple" | "single";
  allowClear?: boolean;
};

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "All",
  searchable = false,
  maxVisible = 120,
  popupMode = "flow",
  selectionMode = "multiple",
  allowClear = true
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedLabels = options
    .filter((option) => selectedSet.has(option.value))
    .map((option) => option.label);
  const summaryText =
    selectedLabels.length === 0 || selectedLabels.length === options.length
      ? placeholder
      : selectedLabels.length === 1
        ? selectedLabels[0]
        : `${selectedLabels.length} selected`;

  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = normalizedQuery
      ? options.filter((option) => `${option.label} ${option.helper ?? ""}`.toLowerCase().includes(normalizedQuery))
      : options;

    return filtered.slice(0, maxVisible);
  }, [maxVisible, options, query]);

  const toggle = (value: string) => {
    if (selectionMode === "single") {
      onChange(selectedSet.has(value) ? [] : [value]);
      setOpen(false);
      return;
    }

    if (selectedSet.has(value)) {
      onChange(selectedValues.filter((item) => item !== value));
      return;
    }

    onChange([...selectedValues, value]);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`filter-card ${
        popupMode === "overlay" ? "relative" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-between gap-3 px-3 py-2 text-left md:min-h-[54px]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${summaryText}`}
      >
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-wide text-muted md:text-[11px]">{label}</div>
          <div className="truncate text-sm font-black text-ink">{summaryText}</div>
        </div>
        <ChevronDown aria-hidden className={`h-4 w-4 shrink-0 text-orangebrand transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className={
            popupMode === "overlay"
              ? "absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-bluebrand/15 bg-white p-2 shadow-[0_22px_55px_rgba(7,0,159,0.18)] ring-1 ring-bluebrand/5"
              : "border-t border-line p-2"
          }
        >
          {searchable ? (
            <label className="mb-2 flex h-10 items-center gap-2 rounded-md border border-line bg-slatepanel px-3 focus-within:border-bluebrand focus-within:bg-white">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                placeholder={`Search ${label.toLowerCase()}`}
              />
            </label>
          ) : null}

          {allowClear && selectedValues.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mb-2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-orangebrand hover:bg-orangebrand/10"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
              Clear
            </button>
          ) : null}

          <div className={`${popupMode === "overlay" ? "max-h-72" : "max-h-64"} overflow-auto pr-1 scrollbar-thin`}>
            {visibleOptions.map((option, index) => {
              const checked = selectedSet.has(option.value);
              const previousGroup = index > 0 ? visibleOptions[index - 1]?.group : undefined;
              const showGroup = option.group && option.group !== previousGroup;

              return (
                <div key={option.value}>
                  {showGroup ? (
                    <div className="sticky top-0 z-10 mb-1 mt-2 rounded-md border border-bluebrand/20 bg-bluebrand px-2 py-1 text-xs font-black uppercase tracking-wide text-white shadow-sm first:mt-0">
                      {option.group}
                    </div>
                  ) : null}
                  <label
                    className={`mb-1 flex min-h-10 cursor-pointer items-start gap-2 rounded-lg px-2 py-2 text-sm transition ${
                      checked ? "bg-bluebrand/10 text-bluebrand ring-1 ring-bluebrand/10" : "hover:bg-slatepanel"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(option.value)}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-orangebrand"
                    />
                    <span className="min-w-0">
                      <span className="block font-semibold leading-snug">{option.label}</span>
                      {option.helper ? <span className="block truncate text-xs text-muted">{option.helper}</span> : null}
                    </span>
                  </label>
                </div>
              );
            })}
            {visibleOptions.length === 0 ? <div className="px-2 py-3 text-sm text-muted">No options</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
