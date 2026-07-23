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
import { ListboxPattern, MultiListboxPattern } from "@/components/patterns/listbox-pattern";
import { ListboxPatternBroken, MultiListboxPatternBroken } from "@/components/patterns/listbox-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("listbox")!;

const CUSTOM_CODE = `function ListboxPattern() {
  const [selected, setSelected] = useState(0);
  const optionRefs = useRef([]);

  function moveTo(index) {
    const clamped = Math.max(0, Math.min(index, OPTIONS.length - 1));
    setSelected(clamped);        // single-select: selection follows focus
    optionRefs.current[clamped]?.focus();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); moveTo(selected + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveTo(selected - 1); }
    else if (e.key === "Home") { e.preventDefault(); moveTo(0); }
    else if (e.key === "End") { e.preventDefault(); moveTo(OPTIONS.length - 1); }
  }

  return (
    <ul role="listbox" aria-labelledby="sort-label" tabIndex={-1} onKeyDown={onKeyDown}>
      {OPTIONS.map((option, i) => (
        <li
          key={option}
          role="option"
          aria-selected={i === selected}
          tabIndex={i === selected ? 0 : -1} // roving tabindex
          onClick={() => moveTo(i)}
        >
          {option}
        </li>
      ))}
    </ul>
  );
}`;

const ARIA_ROWS = [
  { target: "List container", attribute: 'role="listbox"', why: "Identifies the element as a listbox so AT announces it as a selectable list, not a generic group of text." },
  { target: "List container", attribute: "aria-label / aria-labelledby", why: "Gives the listbox an accessible name so it's announced as e.g. \"Sort by, listbox\" rather than an unnamed list." },
  { target: "List container (multi-select only)", attribute: 'aria-multiselectable="true"', why: "Tells AT more than one option may be selected at once, changing how selection state is announced." },
  { target: "Each option", attribute: 'role="option"', why: "Identifies each row as a selectable option within the listbox." },
  { target: "Each option", attribute: "aria-selected", why: "Communicates each option's individual selected/not-selected state — required on every option, including unselected ones." },
  { target: "Each option", attribute: "tabIndex (roving)", why: "Only the active option has tabIndex=0 so Tab moves past the whole widget in one stop; arrow keys move the roving cursor among options with tabIndex=-1." },
];

const KEYBOARD_ROWS = [
  { keys: "Down Arrow", behavior: "Single-select: moves focus to the next option AND selects it. Multi-select: moves focus only, selection unchanged." },
  { keys: "Up Arrow", behavior: "Single-select: moves focus to the previous option AND selects it. Multi-select: moves focus only." },
  { keys: "Space", behavior: "Multi-select only: toggles the focused option's selected state." },
  { keys: "Shift + Down/Up", behavior: "Multi-select only: extends a contiguous selection range from the last toggled option to the newly focused option." },
  { keys: "Ctrl/Cmd + A", behavior: "Multi-select only: selects all options (simplified in this demo's key handler; document the full toggle-all behavior in production)." },
  { keys: "Home / End", behavior: "Moves focus (and, in single-select, selection) to the first / last option." },
];

const SR_ROWS = [
  { step: "Listbox receives focus", jawsChrome: "Sort by, listbox, Relevance, 1 of 5, selected", nvdaFirefox: "Sort by, list, Relevance, 1 of 5, selected", voiceOverSafari: "Sort by, list box, Relevance, selected, 1 of 5" },
  { step: "Single-select: Down Arrow", jawsChrome: "Newest first, 2 of 5, selected", nvdaFirefox: "Newest first, 2 of 5, selected", voiceOverSafari: "Newest first, selected, 2 of 5" },
  { step: "Multi-select: Down Arrow (focus only)", jawsChrome: "TypeScript, 2 of 7, not selected", nvdaFirefox: "TypeScript, 2 of 7", voiceOverSafari: "TypeScript, 2 of 7" },
  { step: "Multi-select: Space toggles selection", jawsChrome: "TypeScript, selected, 2 of 7", nvdaFirefox: "TypeScript, selected, 2 of 7", voiceOverSafari: "TypeScript, selected, 2 of 7" },
];

const DEFECTS = [
  { defect: "Options are unstructured <div>s with no role/aria-selected", severity: "Critical" as const, description: "A screen reader reads the visible text but gives no indication these are selectable list options or which one is selected. Fails SC 4.1.2 Name, Role, Value." },
  { defect: "No keyboard support at all — mouse only", severity: "Critical" as const, description: "Arrow keys, Home, End, and Space do nothing; keyboard-only users cannot operate the list. Fails SC 2.1.1 Keyboard." },
  { defect: "Multi-select shows checkmarks visually but never sets aria-selected", severity: "High" as const, description: "Sighted mouse users see which languages are selected via a checkmark; screen reader users get no equivalent information at all. Fails SC 1.3.1 Info and Relationships and SC 4.1.2." },
  { defect: "No roving tabindex — every option (or none) is a separate Tab stop", severity: "Medium" as const, description: "Tab order through the list is inconsistent with the APG listbox pattern, confusing keyboard users about how to enter and leave the widget. Fails SC 2.1.1." },
];

const TEST_STEPS = [
  { action: "Tab to the listbox.", expected: "Screen reader announces the accessible name, role \"listbox,\" and the currently selected option with its position (e.g. \"1 of 5\")." },
  { action: "Single-select: press Down Arrow repeatedly.", expected: "Focus and selection move together one option at a time; each new option is announced as selected." },
  { action: "Multi-select: press Down Arrow repeatedly.", expected: "Only focus moves; previously selected options remain selected and are not implicitly changed." },
  { action: "Multi-select: press Space on a focused option.", expected: "That option's selected state toggles; screen reader announces the updated selected/not-selected state." },
  { action: "Multi-select: press Shift+Down from a selected option.", expected: "The range of options between the anchor and the new focus position all become selected." },
  { action: "Press Home, then End.", expected: "Focus (and, in single-select, selection) jumps to the first and then the last option respectively." },
];

const CHECKLIST = [
  "Listbox container has an accessible name via aria-label or aria-labelledby.",
  "Every option has role=\"option\" and an explicit aria-selected (true or false).",
  "Multi-select container has aria-multiselectable=\"true\".",
  "Single-select: Up/Down Arrow moves focus and changes selection together.",
  "Multi-select: Up/Down Arrow moves focus only; Space toggles selection of the focused option.",
  "Multi-select: Shift+Down/Up extends a contiguous selection range.",
  "Only one option is in the Tab order at a time (roving tabindex); Tab exits the widget entirely.",
  "Selected state is confirmed audibly with at least one screen reader, not just visually.",
];

export function ListboxPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Forms &amp; Controls</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-6">
          <ListboxPattern />
          <MultiListboxPattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="listbox-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
              <ListboxPattern />
              <MultiListboxPattern />
            </div>
          }
          broken={
            <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
              <ListboxPatternBroken />
              <MultiListboxPatternBroken />
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
              <li>Only one option is in the Tab order at a time (roving tabindex); Tab moves straight past the whole listbox.</li>
              <li>Single-select: moving the roving-tabindex cursor changes selection immediately (selection follows focus).</li>
              <li>Multi-select: moving the roving-tabindex cursor never changes selection by itself — only Space or Shift+Arrow does.</li>
              <li>Clicking an option moves both DOM focus and the roving-tabindex cursor to that option.</li>
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
