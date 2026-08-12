"use client";

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
import { DatePickerPattern } from "@/components/patterns/date-picker-pattern";
import { DatePickerPatternBroken } from "@/components/patterns/date-picker-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("date-picker")!;

const HTML_CODE = `<button id="date-trigger" aria-haspopup="dialog" aria-expanded="false">
  Choose date
</button>

<!-- The calendar popup IS a dialog. Inside, a role="grid" holds the day
     buttons: one owns tabindex="0" (roving), the selected day carries
     aria-selected, and each has a full aria-label so it reads as a date,
     not just a bare number. -->
<div id="date-dialog" role="dialog" aria-modal="true"
     aria-label="Choose date, July 2026" hidden>
  <div role="grid">
    <div role="row">
      <button role="gridcell" tabindex="0"  aria-label="Wednesday, 1 July 2026">1</button>
      <button role="gridcell" tabindex="-1" aria-label="Thursday, 2 July 2026">2</button>
      <!-- … the rest of the week / month … -->
    </div>
  </div>
</div>`;

const JS_CODE = `const grid = document.querySelector('#date-dialog [role="grid"]');
const days = [...grid.querySelectorAll('[role="gridcell"]')];
let focused = 0;

function focusDay(index) {
  // Real code rolls into the previous/next month at the edges; here we
  // just clamp within the rendered days.
  if (index < 0 || index >= days.length) return;
  days[focused].tabIndex = -1;
  focused = index;
  days[index].tabIndex = 0; // roving tabindex: the grid is one Tab stop
  days[index].focus();
}

grid.addEventListener("keydown", (e) => {
  const col = focused % 7;
  switch (e.key) {
    case "ArrowRight": focusDay(focused + 1); break; // next day
    case "ArrowLeft":  focusDay(focused - 1); break; // previous day
    case "ArrowDown":  focusDay(focused + 7); break; // next week
    case "ArrowUp":    focusDay(focused - 7); break; // previous week
    case "Home":       focusDay(focused - col); break;      // start of week
    case "End":        focusDay(focused - col + 6); break;  // end of week
    case "PageUp":     /* e.shiftKey ? previous year : previous month */ break;
    case "PageDown":   /* e.shiftKey ? next year : next month */ break;
    case "Enter":
    case " ":
      days.forEach((d) => d.setAttribute("aria-selected", "false"));
      days[focused].setAttribute("aria-selected", "true");
      break;
    default: return;
  }
  e.preventDefault();
});

// Opening/closing, the focus trap, Escape, and restoring focus to the
// trigger reuse the same logic as the Dialog pattern — this popup IS a
// specialized dialog.`;

const ARIA_ROWS = [
  { target: "Popup container", attribute: 'role="dialog" + aria-modal="true"', why: "Same reasoning as the flagship Dialog pattern: identifies the popup and marks background content inert, backed by an explicit focus trap." },
  { target: "Popup container", attribute: "aria-label (month + year)", why: "Gives the popup an accessible name that includes the currently displayed month, since there's no single visible heading element serving that role." },
  { target: "Calendar table", attribute: 'role="grid"', why: "Exposes the calendar as a 2D grid so assistive technology's grid navigation commands and cell/row semantics apply." },
  { target: "Each week", attribute: 'role="row"', why: "Groups seven date cells into a row, matching the calendar's visual week structure." },
  { target: "Each date", attribute: 'role="gridcell"', why: "Marks each date as a selectable grid cell rather than generic content." },
  { target: "Selected date", attribute: "aria-selected=\"true\"", why: "Communicates the currently selected date's state programmatically, not just via a visual highlight." },
  { target: "Today's / selected date", attribute: 'aria-label="Today, July 2, 2026" / "Selected, ..."', why: "Adds meaning that would otherwise be conveyed only by a visual ring or dot, so it reaches screen reader users too." },
  { target: "Focused date cell only", attribute: "tabIndex={0} (all others tabIndex={-1})", why: "Roving tabindex: keeps a single Tab stop for the whole grid — the same approach used by Menu and Tabs on this site — while arrow keys move the active cell." },
];

const KEYBOARD_ROWS = [
  { keys: "Right Arrow", behavior: "Moves focus to the next day." },
  { keys: "Left Arrow", behavior: "Moves focus to the previous day." },
  { keys: "Down Arrow", behavior: "Moves focus to the same day one week later (+7 days)." },
  { keys: "Up Arrow", behavior: "Moves focus to the same day one week earlier (-7 days)." },
  { keys: "Home", behavior: "Moves focus to the first day (Sunday) of the current week." },
  { keys: "End", behavior: "Moves focus to the last day (Saturday) of the current week." },
  { keys: "Page Up", behavior: "Moves focus to the same day in the previous month." },
  { keys: "Shift+Page Up", behavior: "Moves focus to the same day in the previous year." },
  { keys: "Page Down", behavior: "Moves focus to the same day in the next month." },
  { keys: "Shift+Page Down", behavior: "Moves focus to the same day in the next year." },
  { keys: "Enter / Space", behavior: "Selects the focused date, closes the dialog, and returns focus to the trigger input." },
  { keys: "Escape", behavior: "Closes the dialog without changing the selection and returns focus to the trigger." },
  { keys: "Tab / Shift+Tab", behavior: "Cycles only within the dialog's focusable elements (month nav buttons, the focused date cell) — trapped exactly as in the Dialog pattern." },
];

const SR_ROWS = [
  { step: "Dialog opens (calendar icon button activated)", jawsChrome: "Choose date, July 2026, dialog", nvdaFirefox: "Choose date, July 2026, dialog", voiceOverSafari: "Choose date, July 2026, dialog" },
  { step: "Focus lands on today's date cell", jawsChrome: "Today, July 2, 2026, selected column header row 2 of 6", nvdaFirefox: "Today, July 2, 2026, not selected", voiceOverSafari: "Today, July 2, 2026" },
  { step: "Right Arrow pressed, focus moves one day forward", jawsChrome: "July 3, 2026", nvdaFirefox: "July 3, 2026", voiceOverSafari: "July 3, 2026" },
  { step: "Page Down pressed, focus moves to next month", jawsChrome: "August 2, 2026", nvdaFirefox: "August 2026 (live region), August 2, 2026", voiceOverSafari: "August 2, 2026" },
  { step: "Enter pressed, date selected", jawsChrome: "Choose date, button (focus restored to trigger, input now reads 2026-08-02)", nvdaFirefox: "Choose date, button (focus restored to trigger, input now reads 2026-08-02)", voiceOverSafari: "Choose date, button (focus restored to trigger)" },
];

const DEFECTS = [
  { defect: "Calendar built from <div onClick> cells with no grid/row/gridcell roles", severity: "Critical" as const, description: "The calendar reads as unstructured content to a screen reader — no indication it's a calendar, and no row/column relationship between dates. Fails SC 1.3.1 and 4.1.2." },
  { defect: "No keyboard support at all — mouse-only date selection", severity: "Critical" as const, description: "Dates can only be selected by clicking; there is no way to Tab to a date or move between dates with arrow keys, making the picker entirely unusable without a mouse. Fails SC 2.1.1." },
  { defect: "Popup has no focus trap", severity: "Critical" as const, description: "With the popup open, Tab walks straight through to page content behind it — the same defect category as the broken Dialog pattern. Fails SC 2.1.2 and 4.1.2." },
  { defect: "No Escape handling", severity: "Medium" as const, description: "There is no keyboard-accessible way to dismiss the popup other than an unlabeled click target. Fails SC 2.1.1." },
];

const TEST_STEPS = [
  { action: "Tab to the calendar icon button and press Enter or Space.", expected: "The date picker dialog opens; focus moves to a date cell inside the grid (the selected date, or today if nothing is selected yet)." },
  { action: "Press Right/Left/Up/Down Arrow repeatedly.", expected: "Focus moves by one day / one week in the corresponding direction, staying only on the single roving-tabindex date cell — no other cell is a separate Tab stop." },
  { action: "Press Home, then End.", expected: "Focus jumps to the first day of the current week, then the last day of the current week." },
  { action: "Press Page Down, then Shift+Page Down.", expected: "Focus moves to the same day next month, then the same day next year." },
  { action: "Press Tab while the dialog is open.", expected: "Focus cycles only among the dialog's own focusable elements (month navigation buttons, the current date cell) — it never reaches page content behind the dialog." },
  { action: "Press Enter on a date.", expected: "That date is selected, the dialog closes, the text input updates to show it, and focus returns to the calendar icon button (the trigger)." },
  { action: "Reopen the dialog and press Escape.", expected: "The dialog closes without changing the current selection, and focus returns to the trigger." },
];

const CHECKLIST = [
  "Calendar icon button opens the dialog via keyboard (Enter/Space) as well as mouse.",
  "Dialog has role=\"dialog\", aria-modal=\"true\", and an accessible name that includes the displayed month/year.",
  "Calendar grid uses role=\"grid\"/\"row\"/\"gridcell\" — not unstructured divs.",
  "Only one date cell (the currently focused one) has tabIndex={0}; all others have tabIndex={-1}.",
  "Arrow keys move focus by day/week; Home/End move within the week; PageUp/PageDown (with Shift) move by month/year.",
  "Enter or Space selects the focused date, closes the dialog, and updates the associated text input.",
  "Escape closes the dialog without changing the selection.",
  "Focus is trapped inside the dialog while open, and restored to the trigger button when it closes.",
  "Today's date and the selected date each have a distinguishing visual style AND an accessible label addition (not conveyed by color/style alone).",
];

export function DatePickerPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            A dialog containing an ARIA grid, with the same
            focus-trap/Escape/focus-restore logic as the flagship Dialog
            pattern, plus arrow-key date navigation.
          </p>
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "date-picker.html", code: HTML_CODE },
                { label: "JS", filename: "date-picker.js", code: JS_CODE },
              ]}
            />
          )}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="flex flex-wrap gap-4 rounded-2xl border border-border bg-card p-6">
              <DatePickerPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <DatePickerPatternBroken />
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
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>On open: focus moves to the selected date's cell, or today's cell if nothing is selected yet — the same "move focus into the dialog" requirement as the Dialog pattern.</li>
              <li>While open: Tab/Shift+Tab cycle only within the dialog's focusable elements (reused focus-trap logic from the Dialog pattern).</li>
              <li>Arrow keys, Home/End, and PageUp/PageDown move a roving tabindex within the grid — only one cell is ever a Tab stop at a time.</li>
              <li>On close (Enter/Space select, Escape, or scrim click): focus returns to the trigger button, exactly as the Dialog pattern restores focus to its trigger.</li>
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
