"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import { CHEATSHEET, scToText } from "@/lib/testing-cheatsheet";

const ACCENT: [number, number, number] = [10, 111, 224];

/**
 * jsPDF's built-in Helvetica is Latin-1 only, so Unicode punctuation (arrows,
 * math signs, bullets, curly quotes) drops out and text looks truncated.
 * Swap those for ASCII equivalents before writing them to the PDF. The on-screen
 * HTML table keeps the original glyphs.
 */
function pdfSafe(s: string): string {
  return s
    .replace(/→/g, "->")
    .replace(/←/g, "<-")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/×/g, "x")
    .replace(/[–—]/g, "-")
    .replace(/[•·]/g, "-")
    .replace(/…/g, "...")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"');
}

/**
 * Generates the cheat sheet as a watermarked PDF entirely client-side.
 * jsPDF is dynamically imported so it stays out of the initial bundle and only
 * loads when the user actually asks for the download.
 */
export function CheatSheetDownload() {
  const [busy, setBusy] = React.useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = autoTableModule.default;

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const GState = (doc as unknown as { GState: new (o: { opacity: number }) => unknown }).GState;

      autoTable(doc, {
        startY: 84,
        head: [["#", "Test", "How to test", "Expected result", "WCAG SC"]],
        body: CHEATSHEET.map((r) => [
          String(r.n),
          pdfSafe(r.test),
          pdfSafe(r.how),
          pdfSafe(r.expected),
          pdfSafe(scToText(r.sc)),
        ]),
        theme: "grid",
        rowPageBreak: "auto",
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 5,
          valign: "top",
          overflow: "linebreak",
          textColor: [40, 40, 40],
          lineColor: [222, 226, 232],
          lineWidth: 0.5,
        },
        headStyles: { fillColor: ACCENT, textColor: [255, 255, 255], fontStyle: "bold" },
        alternateRowStyles: { fillColor: [244, 248, 253] },
        columnStyles: {
          0: { cellWidth: 24, halign: "center", textColor: [120, 120, 120] },
          1: { cellWidth: 92, fontStyle: "bold" },
          2: { cellWidth: 248 },
          3: { cellWidth: 268 },
          4: { cellWidth: 128, textColor: ACCENT, fontStyle: "bold" },
        },
        margin: { top: 44, left: 40, right: 40, bottom: 34 },
        didDrawPage: (data) => {
          // ── Tiled "a11yman" watermark on every page ──
          doc.saveGraphicsState();
          doc.setGState(new GState({ opacity: 0.06 }));
          doc.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(26);
          for (let y = 70; y < pageH; y += 130) {
            for (let x = -20; x < pageW + 120; x += 210) {
              doc.text("a11yman", x, y, { angle: 30 });
            }
          }
          doc.restoreGraphicsState();

          // ── Title (first page only) ──
          if (data.pageNumber === 1) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(17);
            doc.setTextColor(20, 20, 20);
            doc.text("Accessibility Testing Cheat Sheet", 40, 42);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text(
              "a11yman   |   Build, Test, Ship Accessible   |   WCAG 2.2 AA   |   work top-to-bottom",
              40,
              60
            );
          }

          // ── Footer on every page ──
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text("a11yman.com - always verify against the latest published spec", 40, pageH - 18);
          doc.text(`Page ${data.pageNumber}`, pageW - 40, pageH - 18, { align: "right" });
        },
      });

      doc.save("a11yman-accessibility-cheat-sheet.pdf");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={busy}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-70"
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {busy ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
