"use client";

import { ChevronLeft, ChevronRight, CircleHelp, Filter, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActiveFilterChips } from "@/components/ActiveFilterChips";
import { CompetishunLogo } from "@/components/CompetishunLogo";
import { FilterPanel } from "@/components/FilterPanel";
import { HowToUseModal } from "@/components/HowToUseModal";
import { PreferenceListPanel, type PreferenceArrangeMode } from "@/components/PreferenceListPanel";
import { RankInputs } from "@/components/RankInputs";
import { ResultCard } from "@/components/ResultCard";
import { ResultsTable } from "@/components/ResultsTable";
import { getBranchDisplayName } from "@/lib/branchGroups";
import { exportPreferencePdf } from "@/lib/exportPreferencePdf";
import { buildFilterOptions, createDefaultFilters, filterJosaaData, getEffectiveCollegeTypes } from "@/lib/filterJosaaData";
import { sortJosaaResults } from "@/lib/sortJosaaResults";
import type { BranchGroupId, CutoffRow, FilteredCutoffRow, JosaaFilters } from "@/lib/types";
import cutoffsJson from "@/data/josaaCutoffs.json";

const cutoffs = cutoffsJson as CutoffRow[];
const PAGE_SIZE = 80;
const GUIDE_STORAGE_KEY = "competishun-josaa-guide-seen-2026";

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function formatBranchSelection(ids: BranchGroupId[]) {
  if (ids.length === 0) {
    return "All branch groups";
  }

  return ids.map(getBranchDisplayName).join(", ");
}

function formatCollegeSelection(filters: JosaaFilters) {
  const types = getEffectiveCollegeTypes(filters);

  return types.length ? types.join(" + ") : "No college type for entered rank";
}

export default function Home() {
  const [filters, setFilters] = useState<JosaaFilters>(() => createDefaultFilters());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [page, setPage] = useState(1);
  const [preferenceRows, setPreferenceRows] = useState<FilteredCutoffRow[]>([]);
  const resultsListTopRef = useRef<HTMLDivElement>(null);
  const pageScrollReadyRef = useRef(false);
  const debouncedProgramQuery = useDebouncedValue(filters.programQuery, 180);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      programQuery: debouncedProgramQuery
    }),
    [debouncedProgramQuery, filters]
  );

  const options = useMemo(() => buildFilterOptions(cutoffs), []);
  const results = useMemo(() => filterJosaaData(cutoffs, effectiveFilters), [effectiveFilters]);
  const preferenceIds = useMemo(() => new Set(preferenceRows.map((row) => row.id)), [preferenceRows]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const visibleRows = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setFilters(createDefaultFilters());
    setPage(1);
    window.scrollTo({ top: 0, behavior: "auto" });

    try {
      if (window.localStorage.getItem(GUIDE_STORAGE_KEY) !== "true") {
        setGuideOpen(true);
      }
    } catch {
      setGuideOpen(true);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [effectiveFilters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!pageScrollReadyRef.current) {
      pageScrollReadyRef.current = true;
      return;
    }

    const targetTop = resultsListTopRef.current?.getBoundingClientRect().top;
    if (typeof targetTop === "number") {
      window.scrollTo({ top: window.scrollY + targetTop - 12, behavior: "auto" });
    }
  }, [page]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const resetFilters = () => setFilters(createDefaultFilters());
  const openGuide = () => setGuideOpen(true);
  const closeGuide = () => {
    setGuideOpen(false);

    try {
      window.localStorage.setItem(GUIDE_STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors; the guide can still be closed for this session.
    }
  };
  const shareOnWhatsApp = () => {
    const text = "Try the Competishun JoSAA College & Branch Predictor 2026: " + window.location.origin;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };
  const patchFilters = (patch: Partial<JosaaFilters>) => setFilters((current) => ({ ...current, ...patch }));
  const togglePreference = (row: FilteredCutoffRow) =>
    setPreferenceRows((current) => {
      if (current.some((item) => item.id === row.id)) {
        return current.filter((item) => item.id !== row.id);
      }

      return [...current, row];
    });
  const removePreference = (id: string) => setPreferenceRows((current) => current.filter((row) => row.id !== id));
  const clearPreferences = () => setPreferenceRows([]);
  const movePreference = (id: string, direction: -1 | 1) =>
    setPreferenceRows((current) => {
      const index = current.findIndex((row) => row.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  const reorderPreference = (sourceId: string, targetId: string) =>
    setPreferenceRows((current) => {
      const sourceIndex = current.findIndex((row) => row.id === sourceId);
      const targetIndex = current.findIndex((row) => row.id === targetId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return current;
      }

      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  const arrangePreferences = (mode: PreferenceArrangeMode) =>
    setPreferenceRows((current) => {
      const byCollege = () => sortJosaaResults(current);
      const byOpeningRank = () =>
        [...current].sort(
          (a, b) =>
            a.collegeTypePriority - b.collegeTypePriority ||
            a.openingRank - b.openingRank ||
            a.closingRank - b.closingRank ||
            a.institutePreferenceRank - b.institutePreferenceRank ||
            a.institute.localeCompare(b.institute)
        );
      const byClosingRank = () =>
        [...current].sort(
          (a, b) =>
            a.collegeTypePriority - b.collegeTypePriority ||
            a.closingRank - b.closingRank ||
            a.openingRank - b.openingRank ||
            a.institutePreferenceRank - b.institutePreferenceRank ||
            a.institute.localeCompare(b.institute)
        );

      if (mode === "opening") {
        return byOpeningRank();
      }

      if (mode === "closing") {
        return byClosingRank();
      }

      return byCollege();
    });
  const handleExportPreferencePdf = async () => {
    if (preferenceRows.length === 0 || exportingPdf) {
      return;
    }

    setExportingPdf(true);

    try {
      await exportPreferencePdf(preferenceRows);
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <main className="min-h-screen">
      <header className="border-b border-bluebrand/10 bg-white/95 shadow-[0_10px_32px_rgba(7,0,159,0.08)] backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-orangebrand via-orangebrand to-bluebrand" />
        <div className="mx-auto flex w-full max-w-[1880px] flex-col gap-3 px-3 py-2 sm:px-6 sm:py-2.5 lg:px-8">
          <div className="flex min-h-11 items-center justify-between gap-3 sm:min-h-14">
            <div className="min-w-0">
              <div className="hidden sm:block">
                <CompetishunLogo />
              </div>
              <div className="sm:hidden">
                <CompetishunLogo compact />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={openGuide}
                className="inline-flex min-h-10 w-10 items-center justify-center gap-2 rounded-xl border border-bluebrand/15 bg-bluebrand/5 text-sm font-black text-bluebrand transition hover:border-bluebrand hover:bg-bluebrand hover:text-white sm:w-auto sm:px-3"
                aria-label="Open how to use guide"
              >
                <CircleHelp aria-hidden className="h-4 w-4" />
                <span className="hidden sm:inline">How to Use</span>
              </button>
              <button
                type="button"
                onClick={shareOnWhatsApp}
                className="inline-flex min-h-10 w-10 items-center justify-center gap-2 rounded-xl border border-[#128c3a]/20 bg-[rgba(18,140,58,0.08)] text-sm font-black text-[#128c3a] transition hover:border-[#128c3a] hover:bg-[#128c3a] hover:text-white sm:w-auto sm:px-3"
                aria-label="Share predictor on WhatsApp"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                <span className="hidden xl:inline">Share</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1880px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <section className="px-2 py-2 text-center sm:py-3">
          <h1 className="mx-auto w-fit max-w-4xl bg-gradient-to-r from-bluebrand via-[#32178c] to-orangebrand bg-clip-text text-xl font-black leading-tight text-transparent drop-shadow-[0_8px_22px_rgba(7,0,159,0.12)] sm:text-3xl">
            JoSAA College & Branch Predictor 2026
          </h1>
          <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-gradient-to-r from-orangebrand to-bluebrand shadow-[0_8px_18px_rgba(7,0,159,0.14)]" />
        </section>

        <section className="rounded-2xl border border-bluebrand/15 bg-white/94 p-3 shadow-[0_16px_38px_rgba(7,0,159,0.09)] backdrop-blur">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:max-w-3xl">
            <RankInputs filters={filters} onChange={patchFilters} compact />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-bluebrand px-4 text-sm font-black text-white shadow-[0_14px_28px_rgba(7,0,159,0.18)] transition hover:bg-bluebrand-dark sm:col-span-2 lg:hidden"
              aria-label="Open filters"
            >
              <Filter aria-hidden className="h-4 w-4" />
              Filters
            </button>
          </div>
        </section>

        <div className="hidden lg:block">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            options={options}
            rows={cutoffs}
            onReset={resetFilters}
            variant="top"
          />
        </div>

        <section className="min-w-0 space-y-2.5 sm:space-y-3">
          {cutoffs.length === 0 ? (
            <div className="rounded-xl border border-line bg-panel p-6 shadow-soft">
              <div className="flex items-center gap-3 text-muted">
                <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
                <span>Loading data</span>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-bluebrand/15 bg-white/95 px-3 py-2.5 shadow-[0_10px_24px_rgba(7,0,159,0.07)] sm:px-4 sm:py-3" aria-live="polite">
            <div className="flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <span className="inline-flex w-fit rounded-full border border-orangebrand/20 bg-orangebrand/10 px-3 py-1.5 text-xs font-black text-orangebrand shadow-[0_8px_18px_rgba(255,91,0,0.08)]">
                  {results.length.toLocaleString("en-IN")} matches
                </span>
                <div className="min-w-0 truncate text-xs font-black text-ink sm:text-sm">
                  {formatBranchSelection(filters.branchGroupIds)} | {formatCollegeSelection(filters)}
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-2">
                {preferenceRows.length > 0 ? (
                  <span className="hidden shrink-0 rounded-full border border-bluebrand/15 bg-bluebrand/5 px-3 py-1.5 text-xs font-black text-bluebrand sm:inline-flex">
                    {preferenceRows.length} selected
                  </span>
                ) : null}
                <ActiveFilterChips filters={filters} onFiltersChange={setFilters} />
              </div>
            </div>
          </div>

          <PreferenceListPanel
            rows={preferenceRows}
            exporting={exportingPdf}
            onArrange={arrangePreferences}
            onClear={clearPreferences}
            onExport={handleExportPreferencePdf}
            onMoveDown={(id) => movePreference(id, 1)}
            onMoveUp={(id) => movePreference(id, -1)}
            onRemove={removePreference}
            onReorder={reorderPreference}
          />

          {results.length === 0 ? (
            <div className="rounded-xl border border-line bg-panel p-8 text-center shadow-[0_16px_38px_rgba(7,0,159,0.08)]">
              <h2 className="text-2xl font-black text-ink">No matching cutoffs</h2>
              <p className="mt-2 text-sm font-semibold text-muted">Change branch, category, home state, or college.</p>
            </div>
          ) : (
            <>
              <div ref={resultsListTopRef} className="scroll-mt-4" />
              <ResultsTable rows={visibleRows} scrollResetKey={page} preferenceIds={preferenceIds} onTogglePreference={togglePreference} />
              <div className="mobile-cards gap-2.5 sm:gap-3">
                {visibleRows.map((row) => (
                  <ResultCard key={row.id} row={row} selected={preferenceIds.has(row.id)} onTogglePreference={togglePreference} />
                ))}
              </div>
              <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-line bg-panel px-3 py-2.5 text-sm shadow-[0_10px_24px_rgba(7,0,159,0.06)] sm:flex-row sm:px-4 sm:py-3">
                <div className="font-semibold text-muted">
                  Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, results.length)} of {results.length.toLocaleString("en-IN")}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="control inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-bold hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft aria-hidden className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="min-w-16 rounded-full bg-bluebrand/10 px-2.5 py-2 text-center font-black text-bluebrand sm:min-w-20 sm:px-3">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    className="control inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-bold hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  >
                    Next
                    <ChevronRight aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] lg:hidden"
          role="dialog"
          aria-modal="true"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="absolute inset-x-3 bottom-3 top-6 overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:inset-x-8"
            onClick={(event) => event.stopPropagation()}
          >
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              options={options}
              rows={cutoffs}
              onReset={resetFilters}
              onClose={() => setDrawerOpen(false)}
              onApply={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <HowToUseModal open={guideOpen} onClose={closeGuide} onShareWhatsApp={shareOnWhatsApp} />
    </main>
  );
}
