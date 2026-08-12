"use client";

import Link from "next/link";
import { useMode } from "@/components/mode-provider";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/reference/code-block";
import { AriaTable } from "@/components/reference/aria-table";
import { KeyboardTable } from "@/components/reference/keyboard-table";
import { ScTable } from "@/components/reference/sc-table";
import { SrAnnouncementTable } from "@/components/reference/sr-announcement-table";
import { DefectPatterns } from "@/components/reference/defect-patterns";
import { TestChecklist } from "@/components/reference/test-checklist";
import { TestProcedure } from "@/components/reference/test-procedure";
import { BrokenFixedToggle } from "@/components/reference/broken-fixed-toggle";
import { ReferencesList } from "@/components/reference/references-list";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { GridPattern } from "@/components/patterns/grid-pattern";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("grid")!;

const HTML_CODE = `<!-- One cell owns tabindex="0"; every other is tabindex="-1" (roving
     tabindex), so the whole grid is a SINGLE Tab stop and arrow keys
     drive navigation. aria-readonly since this grid isn't editable. -->
<div role="grid" aria-label="Quarterly revenue by region" aria-readonly="true">
  <div role="row">
    <div role="columnheader" tabindex="0">Region</div>
    <div role="columnheader" tabindex="-1">Q1</div>
    <div role="columnheader" tabindex="-1">Q2</div>
  </div>
  <div role="row">
    <div role="rowheader" tabindex="-1">North America</div>
    <div role="gridcell"  tabindex="-1">820</div>
    <div role="gridcell"  tabindex="-1">910</div>
  </div>
  <div role="row">
    <div role="rowheader" tabindex="-1">Europe</div>
    <div role="gridcell"  tabindex="-1">640</div>
    <div role="gridcell"  tabindex="-1">700</div>
  </div>
</div>`;

const JS_CODE = `const grid = document.querySelector('[role="grid"]');
// A 2-D map of the cells, row by row.
const rows = [...grid.querySelectorAll('[role="row"]')].map((row) =>
  [...row.querySelectorAll('[role="columnheader"], [role="rowheader"], [role="gridcell"]')]
);
let active = { row: 0, col: 0 };

function focusCell(r, c) {
  rows[active.row][active.col].tabIndex = -1; // give up the old Tab stop
  active = { row: r, col: c };
  rows[r][c].tabIndex = 0;                     // move the single Tab stop
  rows[r][c].focus();
}

grid.addEventListener("keydown", (e) => {
  let { row, col } = active;
  const lastRow = rows.length - 1;
  const lastCol = rows[row].length - 1;
  switch (e.key) {
    case "ArrowRight": col = Math.min(col + 1, lastCol); break;
    case "ArrowLeft":  col = Math.max(col - 1, 0); break;
    case "ArrowDown":  row = Math.min(row + 1, lastRow); break;
    case "ArrowUp":    row = Math.max(row - 1, 0); break;
    case "Home":       col = 0; if (e.ctrlKey) row = 0; break;             // row / grid start
    case "End":        col = lastCol; if (e.ctrlKey) row = lastRow; break; // row / grid end
    default: return;   // let Tab, typing, etc. behave normally
  }
  e.preventDefault();
  focusCell(row, col);
});`;

const ARIA_ROWS = [
  { target: "Grid container", attribute: 'role="grid"', why: "Declares an interactive composite widget so assistive tech switches out of document-reading mode and lets the app's own arrow-key handling drive cell navigation. This is the one thing that distinguishes a grid from a static table." },
  { target: "Grid container", attribute: 'aria-label / aria-labelledby', why: "Gives the whole widget an accessible name (a grid has no <caption>), announced when focus first enters it." },
  { target: "Grid container", attribute: 'aria-readonly="true"', why: "Declares that cells display but cannot be edited. Omit it (or set false) for an editable grid where cells accept input." },
  { target: "Each row", attribute: 'role="row"', why: "Rebuilds the row grouping that div markup loses, so a cell is announced with its row context." },
  { target: "Header cells", attribute: 'role="columnheader" / role="rowheader"', why: "Associates each data cell with its column and row labels, so navigating to a cell announces e.g. \"North America, Q3, 880\" rather than a bare number." },
  { target: "Data cells", attribute: 'role="gridcell"', why: "Marks the individual navigable cells that make up the grid's two-dimensional structure." },
  { target: "Cells (roving tabindex)", attribute: 'tabindex="0" on the active cell, tabindex="-1" on all others', why: "Makes the grid a single stop in the page Tab order; the arrow keys then move the single tabindex=0 among cells and set DOM focus to match, instead of exposing dozens of separate tab stops." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves into and out of the grid as a whole — the entire grid is a single tab stop. Focus lands on whichever cell was last active (initially the first cell)." },
  { keys: "Right / Left Arrow", behavior: "Moves focus one cell right / left within the current row, stopping at the row's edge (no wrap)." },
  { keys: "Down / Up Arrow", behavior: "Moves focus one cell down / up within the current column, stopping at the grid's edge." },
  { keys: "Home / End", behavior: "Moves focus to the first / last cell in the current row." },
  { keys: "Ctrl + Home / Ctrl + End", behavior: "Moves focus to the first cell of the first row / the last cell of the last row." },
];

const SR_ROWS = [
  { step: "Tab moves focus into the grid (first cell)", jawsChrome: "Quarterly revenue by region, grid; North America, row header, column 1 of 5, row 1 of 4", nvdaFirefox: "Quarterly revenue by region grid; North America, row 1, column 1", voiceOverSafari: "Quarterly revenue by region, grid; North America, row 1 of 4, column 1 of 5" },
  { step: "Right Arrow into the first data cell", jawsChrome: "Q1, 820, column 2 of 5", nvdaFirefox: "Q1 820, column 2", voiceOverSafari: "Q1, 820, column 2 of 5" },
  { step: "Down Arrow to the cell below", jawsChrome: "Q1, 640, row 2 of 4", nvdaFirefox: "Q1 640, row 2", voiceOverSafari: "Europe, Q1, 640, row 2 of 4" },
];

const DEFECTS = [
  { defect: "role=\"grid\" with no arrow-key navigation wired up", severity: "Critical" as const, description: "The grid role tells assistive tech the app owns arrow-key navigation and suppresses the screen reader's own table-reading keys — but if the app never implements the arrow handling, the cells become unreachable by keyboard. Either implement full arrow navigation, or use a plain <table>. Fails SC 2.1.1." },
  { defect: "Every cell is a tab stop (no roving tabindex)", severity: "High" as const, description: "Leaving every cell at tabindex=0 forces keyboard users to Tab through dozens or hundreds of stops to pass the grid. A grid must be a single tab stop with arrow-key internal navigation. Fails SC 2.4.3 in spirit and is a severe usability defect." },
  { defect: "Roving tabindex state and DOM focus fall out of sync", severity: "High" as const, description: "Updating which cell has tabindex=0 without also calling .focus() on it (or vice-versa) leaves focus stranded on a cell that is no longer the active one, so the next arrow press jumps unexpectedly. Fails SC 2.4.3 / 2.4.7." },
  { defect: "Used for static, read-only data that a <table> would serve", severity: "Medium" as const, description: "The grid pattern is only warranted when cells are interactive (editable, selectable, or containing widgets). Applying it to plain read-only data needlessly disables the screen reader's native table navigation and adds complex keyboard code with no benefit. Prefer a Table." },
];

const TEST_STEPS = [
  { action: "Tab until focus reaches the grid.", expected: "The whole grid is a single tab stop: one Tab lands inside it (on the last-active or first cell), and the grid announces its name and role." },
  { action: "Press the arrow keys (all four directions).", expected: "Focus moves one cell at a time in the pressed direction, stopping at the grid's edges without wrapping. Each cell announces its value plus row/column header context." },
  { action: "Press Home, then End.", expected: "Focus jumps to the first, then the last cell of the current row." },
  { action: "Press Ctrl+Home, then Ctrl+End.", expected: "Focus jumps to the very first cell of the grid, then the very last cell." },
  { action: "Press Tab again from inside the grid.", expected: "Focus leaves the grid entirely and moves to the next control on the page — it does not step through remaining cells." },
  { action: "Shift+Tab back to the grid.", expected: "Focus returns to the cell that was active when you left, not necessarily the first cell." },
];

const CHECKLIST = [
  "The container uses role=\"grid\" and has an accessible name (aria-label or aria-labelledby).",
  "Rows use role=\"row\"; header cells use role=\"columnheader\"/\"rowheader\"; data cells use role=\"gridcell\".",
  "The grid is a single tab stop: exactly one cell has tabindex=0 and all others have tabindex=-1 (roving tabindex).",
  "Arrow keys move focus one cell in each direction and stop (do not wrap) at the grid's edges.",
  "Home/End move to the row's first/last cell; Ctrl+Home/Ctrl+End move to the grid's first/last cell.",
  "The roving tabindex=0 and actual DOM focus always point to the same cell after every key press.",
  "Navigating to any cell announces its value together with its column (and row) header context.",
  "aria-readonly=\"true\" is present for a display-only grid; editable grids expose per-cell editing instead.",
  "This really needs to be a grid (interactive cells) — static, read-only data uses a Table instead.",
];

export function GridPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{meta.category}</Badge>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
          <LastVerified date="2026-07-08" />
        </header>

      {mode !== "tester" && (
        <PageSection id="implementation" title="Implementation">
          <div className="rounded-2xl border border-border bg-secondary/40 p-4 text-sm">
            <p className="font-medium">Grid or Table?</p>
            <p className="mt-1 text-muted-foreground">
              Reach for the grid pattern only when cells are{" "}
              <strong>interactive</strong> — editable values, selectable cells,
              or cells that contain their own controls — so the widget needs to
              own two-dimensional arrow-key navigation. For static data the user
              only reads, use a{" "}
              <Link href="/components/table" className="text-accent-text underline underline-offset-2">
                Table
              </Link>{" "}
              instead: a real <code className="font-mono">&lt;table&gt;</code>{" "}
              keeps the screen reader&apos;s own table-navigation keys working
              and needs none of this keyboard code. A grid has{" "}
              <strong>no native HTML element</strong>, so unlike a table there is
              no simpler markup to fall back to — every role and key is on you.
            </p>
          </div>
          <div className="mt-4 space-y-3">
            <GridPattern />
            {mode === "developer" && (
              <CodeBlock
                tabs={[
                  { label: "HTML", filename: "grid.html", code: HTML_CODE },
                  { label: "JS", filename: "grid.js", code: JS_CODE },
                ]}
              />
            )}
          </div>
        </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <GridPattern />
            </div>
          }
        />
      </PageSection>

      {mode === "developer" ? (
        <>
          <PageSection id="aria" title="Required roles, states & properties">
            <AriaTable rows={ARIA_ROWS} />
          </PageSection>
          <PageSection id="keyboard" title="Keyboard interaction model">
            <KeyboardTable rows={KEYBOARD_ROWS} />
            <p className="text-sm text-muted-foreground">
              This is the core of the pattern: the grid takes a single Tab stop,
              and the arrow keys (plus Home/End and their Ctrl variants) move a
              roving <code className="font-mono">tabindex=0</code> among the
              cells. A plain Table deliberately does <em>not</em> do this — arrow
              keys there belong to the screen reader, not the app.
            </p>
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Exactly one cell has <code className="font-mono">tabindex=0</code> at any moment; every other cell is <code className="font-mono">tabindex=-1</code>. This is what makes the whole grid a single tab stop.</li>
              <li>Every arrow/Home/End key press updates <em>both</em> the roving tabindex and actual DOM focus in the same handler, so they never drift apart.</li>
              <li>Focus stops at the grid&apos;s edges — arrow keys do not wrap around to the opposite side.</li>
              <li>When focus leaves and later returns via Tab, it lands on the last-active cell, not a reset to the first cell.</li>
            </ul>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection id="test-procedure" title="Keyboard test procedure">
            <TestProcedure steps={TEST_STEPS} />
          </PageSection>
          <PageSection id="sr-announcements" title="Expected screen reader announcements">
            <SrAnnouncementTable rows={SR_ROWS} />
          </PageSection>
          <PageSection id="defects" title="Common defect patterns">
            <DefectPatterns items={DEFECTS} />
          </PageSection>
          <PageSection id="checklist" title="Test case checklist">
            <TestChecklist componentName={meta.name} items={CHECKLIST} />
          </PageSection>
        </>
      )}

      <PageSection id="wcag" title="WCAG 2.2 success criteria mapping">
        <ScTable scIds={meta.scIds} />
      </PageSection>

      <PageSection id="references" title="References">
        <ReferencesList apgUrl={meta.apgUrl} scIds={meta.scIds} />
      </PageSection>
    </div>
  );
}
