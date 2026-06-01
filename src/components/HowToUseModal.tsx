"use client";

import { useEffect } from "react";
import {
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Filter,
  GraduationCap,
  ListChecks,
  MessageCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  X
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onShareWhatsApp: () => void;
};

const GUIDE_ITEMS = [
  {
    icon: Award,
    title: "Enter the correct rank",
    body: "Use JEE Advanced rank for IIT choices and JEE Main rank for NIT, IIIT and GFTI choices. Leave ranks blank when you only want to browse cutoffs."
  },
  {
    icon: Building2,
    title: "Choose college type",
    body: "Start with IIT, NIT, IIIT or GFTI. The predictor keeps colleges grouped in a student-friendly priority order."
  },
  {
    icon: Search,
    title: "Search colleges",
    body: "Use College search when you want a specific institute. Combine it with college type for faster, cleaner results."
  },
  {
    icon: GraduationCap,
    title: "Select branch and course",
    body: "Filter by branch, degree and course duration to compare only the programs that match your target."
  },
  {
    icon: ShieldCheck,
    title: "Set category, gender and home state",
    body: "Match your counselling profile carefully. Quota shown in results tells whether the row is All India, Home State or Other State."
  },
  {
    icon: Filter,
    title: "Read each result row",
    body: "Check institute, program, quota, category, gender, opening rank and closing rank before adding a choice."
  },
  {
    icon: ListChecks,
    title: "Build preference list",
    body: "Tap Add to save choices. Reorder by drag, arrow buttons, college priority, opening rank or closing rank."
  },
  {
    icon: FileText,
    title: "Export and share",
    body: "Export the final preference list as a PDF. Use WhatsApp sharing to send the predictor link to a student or parent."
  }
];

const FLOW_STEPS = ["Enter rank", "Apply filters", "Add choices", "Export PDF"];

export function HowToUseModal({ open, onClose, onShareWhatsApp }: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-bluebrand/45 px-3 py-4 backdrop-blur-sm sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-use-title"
      onClick={onClose}
    >
      <div
        className="mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white shadow-[0_30px_90px_rgba(7,0,159,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative overflow-hidden border-b border-bluebrand/10 bg-[linear-gradient(120deg,rgba(7,0,159,0.08),rgba(255,91,0,0.08),rgba(255,255,255,0.96))] px-4 py-4 sm:px-6">
          <div className="absolute right-0 top-0 h-24 w-40 rounded-bl-[80px] bg-orangebrand/10" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-bluebrand/15 bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-bluebrand">
                <SlidersHorizontal aria-hidden className="h-3.5 w-3.5" />
                2026 Counselling Guide
              </div>
              <h2 id="how-to-use-title" className="mt-3 text-2xl font-black leading-tight text-ink sm:text-3xl">
                How to use this predictor
              </h2>
              <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-muted">
                Follow this flow to shortlist colleges, compare cutoffs and prepare a clean preference list.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-bluebrand/15 bg-white text-muted transition hover:border-orangebrand hover:text-orangebrand"
              aria-label="Close how to use guide"
            >
              <X aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-panel-strong/65 p-3 scrollbar-thin sm:p-5">
          <div className="mb-4 grid gap-2 rounded-2xl border border-bluebrand/12 bg-white p-2 shadow-[0_10px_26px_rgba(7,0,159,0.06)] sm:grid-cols-4">
            {FLOW_STEPS.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-2 rounded-xl bg-panel-strong px-3 py-2 text-xs font-black text-ink"
              >
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bluebrand text-[10px] tabular-nums text-white">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {GUIDE_ITEMS.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-bluebrand/12 bg-white p-3 shadow-[0_10px_26px_rgba(7,0,159,0.06)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bluebrand text-white shadow-[0_10px_22px_rgba(7,0,159,0.18)]">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black uppercase tracking-wide text-orangebrand">
                        Step {index + 1}
                      </div>
                      <h3 className="mt-0.5 text-sm font-black leading-snug text-ink">{item.title}</h3>
                    </div>
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-muted">{item.body}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-orangebrand/20 bg-[linear-gradient(100deg,rgba(255,91,0,0.1),rgba(7,0,159,0.07))] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orangebrand text-white">
                <CheckCircle2 aria-hidden className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-black text-ink">Best workflow</h3>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-muted">
                  First enter rank, then select profile filters, add realistic choices, arrange the list, export PDF and share for review.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:min-w-48">
              <button
                type="button"
                onClick={onShareWhatsApp}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#128c3a] px-4 text-sm font-black text-white shadow-sm transition hover:bg-[#0f7d33]"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                Share on WhatsApp
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-bluebrand/15 bg-white px-4 text-sm font-black text-bluebrand transition hover:border-bluebrand hover:bg-bluebrand hover:text-white"
              >
                <CheckCircle2 aria-hidden className="h-4 w-4" />
                Start using predictor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
