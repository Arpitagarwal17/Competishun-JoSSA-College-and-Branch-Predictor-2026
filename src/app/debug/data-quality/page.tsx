import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { getBranchDisplayName } from "@/lib/branchGroups";
import type { DataQualityReport } from "@/lib/types";
import reportJson from "@/data/dataQualityReport.json";

const report = reportJson as DataQualityReport;

export default function DataQualityPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <header className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <Link href="/" className="control mb-4 inline-flex items-center gap-2 px-3 text-sm font-bold hover:bg-white">
            <ArrowLeft aria-hidden className="h-4 w-4" />
            Predictor
          </Link>
          <div className="flex items-start gap-3">
            <Database aria-hidden className="mt-1 h-6 w-6 text-forest" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brass">Developer console</p>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink">Data Quality Report</h1>
              <p className="mt-2 text-sm text-muted">
                Generated at {report.generatedAt ? new Date(report.generatedAt).toLocaleString("en-IN") : "not generated yet"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Raw rows" value={report.totalRawRows} />
          <Metric label="Validated rows" value={report.totalValidRows} tone="forest" />
          <Metric label="Invalid rows" value={report.totalInvalidRows} tone="clay" />
          <Metric label="Duplicates removed" value={report.totalDuplicatesRemoved} />
          <Metric label="Rank suffix rows" value={report.rankSuffixRows} tone="brass" />
          <Metric label="Missing rank cells" value={report.missingRankRows} tone="clay" />
          <Metric label="Invalid rank cells" value={report.invalidRankRows} tone="clay" />
          <Metric label="Unclassified programs" value={report.unclassifiedProgramCount} tone="brass" />
        </section>

        {report.validationNotes.length > 0 ? (
          <section className="rounded-lg border border-brass/30 bg-[#fff7df] p-4 text-sm">
            <h2 className="mb-2 font-bold">Validation notes</h2>
            <ul className="grid gap-1 text-muted">
              {report.validationNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Source files</h2>
          <div className="mt-4 overflow-auto">
            <table className="min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-[#efe8d8] text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="border-b border-line px-3 py-2">Source</th>
                  <th className="border-b border-line px-3 py-2">Type</th>
                  <th className="border-b border-line px-3 py-2 text-right">Raw</th>
                  <th className="border-b border-line px-3 py-2 text-right">Valid</th>
                  <th className="border-b border-line px-3 py-2 text-right">Invalid</th>
                  <th className="border-b border-line px-3 py-2 text-right">Duplicates</th>
                  <th className="border-b border-line px-3 py-2 text-right">Missing ranks</th>
                  <th className="border-b border-line px-3 py-2 text-right">Invalid ranks</th>
                  <th className="border-b border-line px-3 py-2 text-right">Suffix ranks</th>
                </tr>
              </thead>
              <tbody>
                {report.sourceFiles.map((source) => (
                  <tr key={source.sourceFile} className="border-b border-line/70 last:border-b-0">
                    <td className="px-3 py-2 font-semibold">{source.sourceFile}</td>
                    <td className="px-3 py-2">{source.collegeType}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.rawRows}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.validRows}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.invalidRows}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.duplicatesRemoved}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.missingOpeningRank + source.missingClosingRank}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.invalidOpeningRank + source.invalidClosingRank}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{source.rankSuffixRows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="Rows by college type" entries={Object.entries(report.rowCountsByCollegeType)} />
          <Panel
            title="Rows by branch group"
            entries={Object.entries(report.branchGroupCounts).map(([key, value]) => [getBranchDisplayName(key), value])}
          />
          <Panel title="Seat types" entries={report.seatTypes.map((value) => [value, ""]) as [string, string][]} />
          <Panel title="Quotas" entries={report.quotas.map((value) => [value, ""]) as [string, string][]} />
        </section>

        <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Unclassified programs</h2>
          <p className="mt-1 text-sm text-muted">These remain visible under Other / Unclassified.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {report.unclassifiedPrograms.map((program) => (
              <div key={program} className="rounded-lg border border-line bg-white/70 px-3 py-2 text-sm">
                {program}
              </div>
            ))}
            {report.unclassifiedPrograms.length === 0 ? <div className="text-sm text-muted">No unclassified programs.</div> : null}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
          <h2 className="font-display text-2xl font-bold">Dynamic values</h2>
          <div className="mt-3 grid gap-2 text-sm text-muted">
            <div>Institutes: {report.instituteCount}</div>
            <div>Programs: {report.programCount}</div>
            <div>Unknown seat bases: {report.unknownSeatTypes.length ? report.unknownSeatTypes.join(", ") : "none"}</div>
            <div>Uncommon quotas: {report.uncommonQuotas.length ? report.uncommonQuotas.join(", ") : "none"}</div>
            <div>Genders: {report.genders.join(", ")}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone?: "forest" | "brass" | "clay" }) {
  const toneClass = tone === "forest" ? "text-forest" : tone === "brass" ? "text-brass" : tone === "clay" ? "text-clay" : "text-ink";

  return (
    <div className="rounded-lg border border-line bg-panel p-4 shadow-soft">
      <div className="text-xs font-bold uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1 text-3xl font-bold tabular-nums ${toneClass}`}>{value.toLocaleString("en-IN")}</div>
    </div>
  );
}

function Panel({ title, entries }: { title: string; entries: [string, number | string][] }) {
  return (
    <section className="rounded-lg border border-line bg-panel p-5 shadow-soft">
      <h2 className="font-display text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-2">
        {entries.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white/70 px-3 py-2 text-sm">
            <span>{label}</span>
            {value !== "" ? <span className="font-bold tabular-nums">{Number(value).toLocaleString("en-IN")}</span> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
