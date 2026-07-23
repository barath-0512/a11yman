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
import { TablePattern } from "@/components/patterns/table-pattern";
import { TablePatternBroken } from "@/components/patterns/table-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("table")!;

const CUSTOM_CODE = `function toggleSort(key) {
  if (key !== sortKey) { setSortKey(key); setSortDirection("ascending"); return; }
  setSortDirection(prev =>
    prev === "ascending" ? "descending" : prev === "descending" ? "none" : "ascending"
  );
}

<th scope="col" aria-sort={ariaSortFor("name")}>
  <button
    onClick={() => toggleSort("name")}
    aria-label={\`Sort by Name, \${sortLabelText}\`}
  >
    Name <SortIcon />
  </button>
</th>

/* aria-sort lives on the <th> itself, not the button — that's where
   assistive tech looks for a column's current sort state. The button
   inside is what makes the control keyboard-operable. */`;

const ARIA_ROWS = [
  { target: "<table>", attribute: "<caption>", why: "Gives the table an accessible name/purpose announced before a screen reader user enters it (not itself an ARIA attribute, but the required native equivalent)." },
  { target: "Column header <th>", attribute: 'scope="col"', why: "Associates the header with every cell in its column, so jumping to any cell also announces the relevant column label." },
  { target: "Row header <th>", attribute: 'scope="row"', why: "Associates the header with every cell in its row, giving row context (e.g. person's name) alongside any cell value." },
  { target: "Sortable column <th>", attribute: 'aria-sort="ascending" | "descending" | "none"', why: "Communicates the column's current sort state. Lives on the header cell, updated dynamically as sort changes — never left stale." },
  { target: "Sort control", attribute: "Real <button> inside the <th>, with a composed aria-label", why: 'Keeps the control keyboard-operable and gives it an unambiguous accessible name like "Sort by Name, currently sorted ascending" instead of just the icon or a bare column label.' },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves between interactive elements (sort buttons, any row action buttons) in reading order — normal document tab order, nothing custom." },
  { keys: "Enter / Space", behavior: "Activates the focused sort button, re-sorting the table and updating aria-sort." },
];

const SR_ROWS = [
  { step: "Focus lands on the Name sort button (unsorted)", jawsChrome: "Sort by Name, not sorted, button", nvdaFirefox: "Sort by Name, not sorted, button", voiceOverSafari: "Sort by Name, not sorted, button" },
  { step: "Sort button activated, column now sorted ascending", jawsChrome: "Sort by Name, currently sorted ascending, button; Name, column header, sorted ascending", nvdaFirefox: "Sort by Name, currently sorted ascending, button", voiceOverSafari: "Sort by Name, currently sorted ascending, button" },
  { step: "Screen reader user navigates cell-by-cell (table nav keys)", jawsChrome: "Active, Status, row 2 of 5", nvdaFirefox: "Active, column 3, Status", voiceOverSafari: "Active, column 3 of 4, Status" },
];

const DEFECTS = [
  { defect: "Missing <caption>", severity: "Medium" as const, description: "No visible or hidden statement of what the table contains before a screen reader user navigates into it. Fails SC 1.3.1." },
  { defect: "Data cells have no header association", severity: "Critical" as const, description: "Header row uses <td> instead of <th scope=\"col\">, and there is no row header. Navigating cell-by-cell announces a bare value like \"Suspended\" with no row or column context. Fails SC 1.3.1 and 4.1.2." },
  { defect: "Sort control is a <div onClick> wrapping the whole header cell", severity: "Critical" as const, description: "The header cell itself is not natively focusable or operable — keyboard users cannot reach or activate it at all, so the table cannot be sorted without a mouse. Fails SC 2.1.1 and 4.1.2." },
  { defect: "No aria-sort on sortable columns", severity: "High" as const, description: "Even when sorting does work, there is no programmatic indication of current sort state, so screen reader users can't tell if a column is sorted ascending, descending, or not at all. Fails SC 4.1.2." },
];

const TEST_STEPS = [
  { action: "Tab to a sortable column's sort button.", expected: "Screen reader announces the composed label, e.g. \"Sort by Name, not sorted, button.\"" },
  { action: "Press Enter or Space to activate it.", expected: "Table re-sorts; the button's accessible name updates to reflect the new state (\"currently sorted ascending\"), and the <th>'s aria-sort attribute changes to match." },
  { action: "Activate the same sort button again.", expected: "Sort direction toggles (ascending → descending → none), with each state correctly reflected in aria-sort and the accessible name." },
  { action: "Tab through the rest of the table.", expected: "Focus moves only to interactive elements (other sort buttons, row actions) in reading order — there is no unexpected arrow-key cell navigation to test on a basic sortable table." },
  { action: "With a screen reader, navigate cell-by-cell using its table navigation keys (e.g. NVDA/JAWS Ctrl+Alt+Arrow).", expected: "Every data cell announces its associated column header (and row header, if present) alongside its value." },
];

const CHECKLIST = [
  "Table has a <caption> (visible or visually-hidden) describing its purpose.",
  "Every column header is a real <th scope=\"col\">.",
  "Row headers (if applicable) are <th scope=\"row\">.",
  "Sortable columns carry aria-sort=\"ascending\"|\"descending\"|\"none\" on the <th>, kept in sync with actual state.",
  "The interactive sort control is a real <button>, not the whole header cell wired to a click handler.",
  "The sort button's accessible name communicates both the column and the current sort direction.",
  "Tab order visits only interactive elements (sort buttons, row actions) — no unexpected stops on static cells.",
  "Cell-by-cell screen reader navigation announces correct row/column header context for every cell.",
  "Table remains usable and does not clip/overflow at 200% browser zoom.",
];

export function TablePageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <TablePattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="table-pattern.tsx (sort logic)" />}
          <p className="text-sm text-muted-foreground">
            For an <em>interactive</em> tabular widget — editable, selectable,
            or arrow-key-navigable cells — see the{" "}
            <Link href="/components/grid" className="text-accent-text underline underline-offset-2">
              Grid pattern
            </Link>{" "}
            (<code className="font-mono">role=&quot;grid&quot;</code>) instead.
          </p>
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <TablePattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <TablePatternBroken />
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
              A basic sortable table does not need arrow-key grid/cell
              navigation — that belongs to a spreadsheet-style ARIA grid
              pattern and is out of scope here. Testers should not expect
              arrow keys to move between cells in this pattern.
            </p>
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Only interactive elements (sort buttons, row action buttons) are ever in the Tab order — static data cells are never focus stops.</li>
              <li>Activating a sort button never moves focus away from that button, even though the row order changes underneath it.</li>
              <li>Column header aria-sort and the button's accessible name are updated together, synchronously with the re-sort, so they never fall out of sync.</li>
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
