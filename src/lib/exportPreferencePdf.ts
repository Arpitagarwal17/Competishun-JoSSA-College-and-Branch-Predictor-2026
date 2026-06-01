import { getGenderLabel, getQuotaLabel, getSeatTypeLabel } from "./displayLabels";
import type { FilteredCutoffRow } from "./types";

type RGB = [number, number, number];

const BLUE: RGB = [7, 0, 159];
const BLUE_DARK: RGB = [16, 23, 53];
const ORANGE: RGB = [255, 91, 0];
const MUTED: RGB = [102, 114, 138];
const LINE: RGB = [207, 219, 247];
const ORANGE_SOFT: RGB = [255, 241, 232];
const BLUE_SOFT: RGB = [237, 240, 255];

async function imageToDataUrl(path: string) {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function formatRank(rank: number) {
  return rank.toLocaleString("en-IN");
}

function formatPdfCategory(seatType: string) {
  return getSeatTypeLabel(seatType).replace(/\s+-\s+/g, "\n");
}

function formatPdfGender(gender: string) {
  return getGenderLabel(gender).replace("Gender-Neutral", "Gender\nNeutral");
}

function compactDate() {
  return new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function drawTopRule(doc: any, pageWidth: number) {
  doc.setFillColor(...ORANGE);
  doc.rect(0, 0, pageWidth * 0.36, 6, "F");
  doc.setFillColor(...BLUE);
  doc.rect(pageWidth * 0.36, 0, pageWidth, 6, "F");
}

function drawHeader(doc: any, logo: string | null, generatedAt: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  drawTopRule(doc, pageWidth);

  if (logo) {
    doc.addImage(logo, "PNG", 24, 20, 156, 31);
  } else {
    doc.setTextColor(...BLUE);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("competishun", 24, 40);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...BLUE_DARK);
  doc.text("JoSAA Preference List 2026", pageWidth / 2, 39, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${generatedAt}`, pageWidth - 24, 39, { align: "right" });

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.8);
  doc.line(24, 64, pageWidth - 24, 64);
}

function drawFooter(doc: any, pageNumber: number, pageWidth: number, pageHeight: number) {
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(32, pageHeight - 30, pageWidth - 32, pageHeight - 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Page ${pageNumber}`, pageWidth - 32, pageHeight - 15, { align: "right" });
}

export async function createPreferencePdf(rows: FilteredCutoffRow[]) {
  if (rows.length === 0) {
    return null;
  }

  const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const autoTable = autoTableModule.default;
  const doc = new jsPDF({ format: "a4", orientation: "landscape", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const generatedAt = compactDate();
  let logo: string | null = null;

  try {
    logo = await imageToDataUrl("/competishun-logo-display.png");
  } catch {
    logo = null;
  }

  drawHeader(doc, logo, generatedAt);

  autoTable(doc, {
    startY: 78,
    margin: { top: 48, right: 20, bottom: 42, left: 20 },
    tableWidth: "wrap",
    showHead: "everyPage",
    head: [["#", "Type", "Institute", "Program", "Quota", "Category", "Gender", "Opening", "Closing"]],
    body: rows.map((row, index) => [
      String(index + 1),
      row.collegeType,
      row.institute,
      row.program,
      getQuotaLabel(row.quota),
      formatPdfCategory(row.seatType),
      formatPdfGender(row.gender),
      formatRank(row.openingRank),
      formatRank(row.closingRank)
    ]),
    theme: "grid",
    styles: {
      cellPadding: { top: 4.5, right: 4, bottom: 4.5, left: 4 },
      font: "helvetica",
      fontSize: 7.4,
      lineColor: LINE,
      lineWidth: 0.45,
      minCellWidth: 6,
      minCellHeight: 22,
      overflow: "linebreak",
      textColor: BLUE_DARK,
      valign: "middle"
    },
    alternateRowStyles: {
      fillColor: [248, 251, 255]
    },
    headStyles: {
      cellPadding: { top: 7, right: 4, bottom: 7, left: 4 },
      fillColor: BLUE,
      fontSize: 7.6,
      fontStyle: "bold",
      halign: "left",
      textColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 28, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 32, halign: "center", fontStyle: "bold", textColor: BLUE },
      2: { cellWidth: 142, fontStyle: "bold" },
      3: { cellWidth: 228 },
      4: { cellWidth: 64 },
      5: { cellWidth: 110 },
      6: { cellWidth: 70 },
      7: { cellWidth: 48, halign: "right", fontStyle: "bold", textColor: BLUE },
      8: { cellWidth: 48, halign: "right", fontStyle: "bold", textColor: ORANGE }
    },
    didParseCell: (data: any) => {
      if (data.section !== "body") {
        return;
      }

      if (data.column.index === 1) {
        data.cell.styles.fillColor = BLUE_SOFT;
      }

      if (data.column.index === 7) {
        data.cell.styles.fillColor = BLUE_SOFT;
        data.cell.styles.textColor = BLUE;
      }

      if (data.column.index === 8) {
        data.cell.styles.fillColor = ORANGE_SOFT;
        data.cell.styles.textColor = ORANGE;
      }
    },
    didDrawPage: (data: any) => {
      const pageNumber = data.pageNumber;

      if (pageNumber > 1) {
        drawTopRule(doc, pageWidth);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...BLUE_DARK);
        doc.text("JoSAA Preference List 2026", pageWidth / 2, 30, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(`Generated ${generatedAt}`, pageWidth - 32, 30, { align: "right" });
      }

      drawFooter(doc, pageNumber, pageWidth, pageHeight);
    }
  });

  return doc;
}

export async function exportPreferencePdf(rows: FilteredCutoffRow[]) {
  const doc = await createPreferencePdf(rows);

  if (!doc) {
    return;
  }

  doc.save("competishun-josaa-preference-list-2026.pdf");
}
