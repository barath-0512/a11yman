"use client";

import * as React from "react";

/**
 * Hand-coded interactive data grid using the ARIA grid pattern (role="grid").
 *
 * The defining difference from a plain <table>: the grid is a single Tab stop
 * that the user then explores in two dimensions with the arrow keys. A real
 * <table> is static content read cell-by-cell with the screen reader's own
 * table-navigation keys; a grid is a *widget* the browser hands full keyboard
 * control of.
 *
 * Roles / attributes and why they exist:
 * - role="grid": tells AT this is an interactive composite widget, so it
 *   switches out of "reading" mode and lets the app's own arrow-key handling
 *   drive navigation.
 * - role="row" / role="columnheader" / role="rowheader" / role="gridcell":
 *   rebuild the tabular structure that div markup otherwise loses, so cell
 *   values are still announced with their row and column context.
 * - aria-readonly="true": this demo grid is navigable but not editable, so we
 *   declare it — an editable grid would omit this and expose per-cell editing.
 * - Roving tabindex: exactly one cell has tabindex=0 (the rest are -1), so the
 *   grid is one stop in the page Tab sequence and never traps the user in a
 *   thicket of dozens of tab stops.
 */

const COLUMNS = ["Region", "Q1", "Q2", "Q3", "Q4"] as const;

const ROWS: { region: string; values: number[] }[] = [
  { region: "North America", values: [820, 910, 880, 1020] },
  { region: "Europe", values: [610, 640, 700, 760] },
  { region: "Asia Pacific", values: [430, 520, 610, 690] },
  { region: "Latin America", values: [180, 210, 240, 260] },
];

const ROW_COUNT = ROWS.length;
const COL_COUNT = COLUMNS.length;

export function GridPattern() {
  // The single cell that currently owns tabindex=0 (roving tabindex).
  const [active, setActive] = React.useState({ row: 0, col: 0 });
  const cellRefs = React.useRef<(HTMLDivElement | null)[][]>([]);

  function focusCell(row: number, col: number) {
    setActive({ row, col });
    cellRefs.current[row]?.[col]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, row: number, col: number) {
    let r = row;
    let c = col;
    switch (e.key) {
      case "ArrowRight":
        c = Math.min(col + 1, COL_COUNT - 1);
        break;
      case "ArrowLeft":
        c = Math.max(col - 1, 0);
        break;
      case "ArrowDown":
        r = Math.min(row + 1, ROW_COUNT - 1);
        break;
      case "ArrowUp":
        r = Math.max(row - 1, 0);
        break;
      case "Home":
        // Home = start of row; Ctrl+Home = very first cell.
        c = 0;
        if (e.ctrlKey) r = 0;
        break;
      case "End":
        // End = end of row; Ctrl+End = very last cell.
        c = COL_COUNT - 1;
        if (e.ctrlKey) r = ROW_COUNT - 1;
        break;
      default:
        return; // let every other key (Tab, typing, etc.) behave normally
    }
    e.preventDefault();
    focusCell(r, c);
  }

  return (
    <div className="overflow-x-auto">
      <div
        role="grid"
        aria-label="Quarterly revenue by region, in thousands of US dollars"
        aria-readonly="true"
        aria-rowcount={ROW_COUNT + 1}
        aria-colcount={COL_COUNT}
        className="inline-grid min-w-full rounded-2xl border border-border text-sm [grid-template-columns:repeat(5,minmax(6rem,1fr))]"
      >
        {/* Column header row — presentational stop, not part of the roving set. */}
        <div role="row" className="contents">
          {COLUMNS.map((label, col) => (
            <div
              key={label}
              role="columnheader"
              aria-colindex={col + 1}
              className="border-b border-border bg-secondary/60 px-3 py-2 font-semibold"
            >
              {label}
            </div>
          ))}
        </div>

        {ROWS.map((rowData, row) => {
          cellRefs.current[row] = cellRefs.current[row] ?? [];
          const cells = [rowData.region, ...rowData.values.map(String)];
          return (
            <div role="row" aria-rowindex={row + 2} className="contents" key={rowData.region}>
              {cells.map((value, col) => {
                const isRowHeader = col === 0;
                const isActive = active.row === row && active.col === col;
                return (
                  <div
                    key={col}
                    ref={(el) => {
                      cellRefs.current[row][col] = el;
                    }}
                    role={isRowHeader ? "rowheader" : "gridcell"}
                    aria-colindex={col + 1}
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={(e) => handleKeyDown(e, row, col)}
                    onClick={() => focusCell(row, col)}
                    className={
                      "border-t border-border px-3 py-2 focus:bg-accent/10 " +
                      (isRowHeader
                        ? "whitespace-nowrap font-medium"
                        : "text-muted-foreground tabular-nums")
                    }
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Tab once to enter the grid, then use the{" "}
        <kbd className="rounded border border-border px-1">↑</kbd>{" "}
        <kbd className="rounded border border-border px-1">↓</kbd>{" "}
        <kbd className="rounded border border-border px-1">←</kbd>{" "}
        <kbd className="rounded border border-border px-1">→</kbd> arrow keys
        (plus Home / End, Ctrl+Home / Ctrl+End) to move between cells.
      </p>
    </div>
  );
}
