"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowDownUp, ArrowUp, Download, GripVertical, ListChecks, Trash2, X } from "lucide-react";
import { getGenderLabel, getQuotaLabel, getSeatTypeLabel } from "@/lib/displayLabels";
import type { FilteredCutoffRow } from "@/lib/types";

type Props = {
  rows: FilteredCutoffRow[];
  exporting: boolean;
  onArrange: (mode: PreferenceArrangeMode) => void;
  onClear: () => void;
  onExport: () => void;
  onMoveDown: (id: string) => void;
  onMoveUp: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (sourceId: string, targetId: string) => void;
};

export type PreferenceArrangeMode = "college" | "opening" | "closing";

const ARRANGE_OPTIONS: Array<{ value: PreferenceArrangeMode; label: string }> = [
  { value: "college", label: "College priority" },
  { value: "opening", label: "Opening rank" },
  { value: "closing", label: "Closing rank" }
];

function formatRank(rank: number) {
  return rank.toLocaleString("en-IN");
}

type DragPreview = {
  collegeType: string;
  index: number;
  institute: string;
  program: string;
  x: number;
  y: number;
};

export function PreferenceListPanel({ rows, exporting, onArrange, onClear, onExport, onMoveDown, onMoveUp, onRemove, onReorder }: Props) {
  const hasRows = rows.length > 0;
  const choiceLabel = rows.length === 1 ? "choice" : "choices";
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [pointerDragId, setPointerDragId] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const pointerOverIdRef = useRef<string | null>(null);

  const endDrag = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
    setPointerDragId(null);
    setDragPreview(null);
    pointerOverIdRef.current = null;
  }, []);

  useEffect(() => {
    if (!pointerDragId) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;
    const previousCursor = document.body.style.cursor;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      setDragPreview((current) => (current ? { ...current, x: event.clientX, y: event.clientY } : current));

      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-preference-id]") as HTMLElement | null;
      const targetId = target?.dataset.preferenceId ?? null;

      if (targetId && targetId !== pointerOverIdRef.current) {
        pointerOverIdRef.current = targetId;
        setDragOverId(targetId);
      }
    };

    const handlePointerUp = () => {
      const targetId = pointerOverIdRef.current;

      if (targetId && targetId !== pointerDragId) {
        onReorder(pointerDragId, targetId);
      }

      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      endDrag();
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    document.addEventListener("pointermove", handlePointerMove, { passive: false });
    document.addEventListener("pointerup", handlePointerUp, { once: true });
    document.addEventListener("pointercancel", handlePointerUp, { once: true });

    return () => {
      document.body.style.userSelect = previousUserSelect;
      document.body.style.cursor = previousCursor;
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [endDrag, onReorder, pointerDragId]);

  return (
    <section className={`${hasRows ? "" : "hidden sm:block"} overflow-hidden rounded-2xl border border-bluebrand/15 bg-white/95 shadow-[0_12px_28px_rgba(7,0,159,0.08)]`}>
      <div className="border-b border-bluebrand/10 bg-[linear-gradient(115deg,rgba(7,0,159,0.08),rgba(255,91,0,0.07))] px-3 py-2.5 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 shrink items-center gap-2">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bluebrand text-white shadow-[0_8px_18px_rgba(7,0,159,0.18)]">
              <ListChecks aria-hidden className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-black text-ink sm:text-base">Preferences</h2>
              <div className="text-[10px] font-bold uppercase tracking-wide text-muted sm:text-xs">
                {rows.length} {choiceLabel} selected
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1.5">
            {hasRows ? (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 text-xs font-black text-muted transition hover:border-orangebrand hover:text-orangebrand"
                aria-label="Clear preference list"
              >
                <X aria-hidden className="h-4 w-4" />
                Clear
              </button>
            ) : null}
            <button
              type="button"
              onClick={onExport}
              disabled={!hasRows || exporting}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-orangebrand px-3 text-xs font-black text-white shadow-sm transition hover:bg-orangebrand-dark disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Export preference list as PDF"
            >
              <Download aria-hidden className="h-4 w-4" />
              {exporting ? "Preparing PDF" : "Export PDF"}
            </button>
          </div>
        </div>

        <div className="mt-2">
          {hasRows ? (
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-bluebrand/10 bg-white/85 p-1 shadow-sm sm:flex sm:flex-nowrap sm:items-center sm:justify-end sm:gap-1">
              <span className="hidden items-center gap-1 px-2 text-[11px] font-black uppercase tracking-wide text-muted md:inline-flex">
                <ArrowDownUp aria-hidden className="h-3.5 w-3.5" />
                Arrange
              </span>
              {ARRANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onArrange(option.value)}
                  className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg px-2 text-[11px] font-black text-bluebrand transition hover:bg-bluebrand hover:text-white sm:justify-start"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {dragPreview ? (
        <div
          className="pointer-events-none fixed z-[70] w-[min(360px,calc(100vw-2rem))] rounded-xl border border-orangebrand/45 bg-white px-4 py-3 shadow-[0_22px_58px_rgba(255,91,0,0.22)] ring-4 ring-orangebrand/10"
          style={{ left: dragPreview.x + 14, top: dragPreview.y + 14 }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orangebrand text-xs font-black tabular-nums text-white">
              {dragPreview.index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-bluebrand/20 bg-bluebrand/10 px-2 py-0.5 text-[11px] font-black text-bluebrand">
                  {dragPreview.collegeType}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wide text-orangebrand">Moving</span>
              </div>
              <div className="mt-1 truncate text-sm font-black text-ink">{dragPreview.institute}</div>
              <div className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-muted">{dragPreview.program}</div>
            </div>
          </div>
        </div>
      ) : null}

      {hasRows ? (
        <ol className="preference-grid grid max-h-[22rem] gap-2.5 overflow-auto bg-panel-strong/55 p-2 scrollbar-thin md:max-h-[28rem] md:p-3">
          {rows.map((row, index) => (
            <li
              key={row.id}
              data-preference-id={row.id}
              draggable
              onDragStart={(event) => {
                setDraggedId(row.id);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", row.id);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (dragOverId !== row.id) {
                  setDragOverId(row.id);
                }
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setDragOverId(null);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const sourceId = draggedId ?? event.dataTransfer.getData("text/plain");
                if (sourceId && sourceId !== row.id) {
                  onReorder(sourceId, row.id);
                }
                endDrag();
              }}
              onDragEnd={endDrag}
              className={`rounded-xl border bg-white p-2.5 shadow-sm transition ${
                draggedId === row.id
                  ? "scale-[0.985] border-bluebrand/25 bg-bluebrand/5 opacity-45"
                  : dragOverId === row.id
                    ? "border-orangebrand bg-orangebrand/10 shadow-[0_16px_34px_rgba(255,91,0,0.16)] ring-2 ring-orangebrand/25"
                    : "border-line hover:border-bluebrand/25 hover:shadow-[0_12px_28px_rgba(7,0,159,0.09)]"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex shrink-0 items-center gap-1">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bluebrand text-xs font-black tabular-nums text-white">
                    {index + 1}
                  </span>
                  <span
                    className={`inline-flex h-9 w-7 touch-none cursor-grab items-center justify-center rounded-lg transition active:cursor-grabbing ${
                      draggedId === row.id ? "bg-orangebrand text-white shadow-sm" : "text-muted hover:bg-bluebrand/5 hover:text-bluebrand"
                    }`}
                    title="Drag to reorder"
                    aria-label="Drag to reorder preference"
                    onPointerDown={(event) => {
                      if (event.pointerType === "mouse" && event.button !== 0) {
                        return;
                      }

                      event.preventDefault();
                      pointerOverIdRef.current = row.id;
                      setPointerDragId(row.id);
                      setDraggedId(row.id);
                      setDragOverId(row.id);
                      setDragPreview({
                        collegeType: row.collegeType,
                        index,
                        institute: row.institute,
                        program: row.program,
                        x: event.clientX,
                        y: event.clientY
                      });
                    }}
                  >
                    <GripVertical aria-hidden className="h-4 w-4" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full border border-bluebrand/20 bg-bluebrand/10 px-2 py-0.5 text-[10px] font-black text-bluebrand">
                      {row.collegeType}
                    </span>
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm font-black leading-snug text-ink">{row.institute}</div>
                  <div className="mt-1 line-clamp-1 text-xs font-semibold leading-snug text-muted">{row.program}</div>
                  <div className="mt-2 flex gap-1.5">
                    <div className="min-w-0 flex-1 rounded-full border border-bluebrand/15 bg-bluebrand/5 px-2 py-1">
                      <div className="text-[9px] font-black uppercase tracking-wide text-muted">Opening</div>
                      <div className="mt-0.5 text-sm font-black tabular-nums text-bluebrand">{formatRank(row.openingRank)}</div>
                    </div>
                    <div className="min-w-0 flex-1 rounded-full border border-orangebrand/20 bg-orangebrand/10 px-2 py-1">
                      <div className="text-[9px] font-black uppercase tracking-wide text-muted">Closing</div>
                      <div className="mt-0.5 text-sm font-black tabular-nums text-orangebrand">{formatRank(row.closingRank)}</div>
                    </div>
                  </div>
                  <div className="mt-1.5 flex gap-1 overflow-x-auto pb-0.5 text-[10px] font-bold text-ink scrollbar-thin">
                    <span className="shrink-0 rounded-md bg-bluebrand/5 px-2 py-1">{getQuotaLabel(row.quota)}</span>
                    <span className="shrink-0 rounded-md bg-bluebrand/5 px-2 py-1">{getSeatTypeLabel(row.seatType)}</span>
                    <span className="shrink-0 rounded-md bg-bluebrand/5 px-2 py-1">{getGenderLabel(row.gender)}</span>
                  </div>
                </div>
                <div className="grid shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => onMoveUp(row.id)}
                    disabled={index === 0}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-bluebrand transition hover:border-bluebrand disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Move preference up"
                  >
                    <ArrowUp aria-hidden className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onMoveDown(row.id)}
                    disabled={index === rows.length - 1}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-bluebrand transition hover:border-bluebrand disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label="Move preference down"
                  >
                    <ArrowDown aria-hidden className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-muted transition hover:border-orangebrand hover:text-orangebrand"
                    aria-label="Remove preference"
                  >
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="bg-panel-strong/55 px-4 py-5 text-sm font-semibold text-muted">Add choices from the results.</div>
      )}
    </section>
  );
}
