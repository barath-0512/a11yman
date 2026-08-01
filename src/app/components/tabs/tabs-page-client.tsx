"use client";

import * as React from "react";
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
import { TabsPattern } from "@/components/patterns/tabs-pattern";
import { TabsPatternBroken } from "@/components/patterns/tabs-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("tabs")!;

const HTML_CODE = `<div class="tabs">
  <!-- The tablist. Each tab's aria-controls points at its panel; each
       panel's aria-labelledby points back. Only the selected tab has
       aria-selected="true" and tabindex="0" (roving tabindex). -->
  <div role="tablist" aria-label="Account settings">
    <button role="tab" id="tab-profile"  aria-selected="true"  aria-controls="panel-profile"  tabindex="0">Profile</button>
    <button role="tab" id="tab-billing"  aria-selected="false" aria-controls="panel-billing"  tabindex="-1">Billing</button>
    <button role="tab" id="tab-security" aria-selected="false" aria-controls="panel-security" tabindex="-1">Security</button>
  </div>

  <div role="tabpanel" id="panel-profile"  aria-labelledby="tab-profile"  tabindex="0">…</div>
  <div role="tabpanel" id="panel-billing"  aria-labelledby="tab-billing"  tabindex="0" hidden>…</div>
  <div role="tabpanel" id="panel-security" aria-labelledby="tab-security" tabindex="0" hidden>…</div>
</div>`;

const JS_CODE = `const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];

function select(tab) {
  tabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", String(selected));
    t.tabIndex = selected ? 0 : -1; // roving tabindex: a single Tab stop
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  });
}

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => select(tab));

  tab.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    // Automatic activation: selection follows focus. For MANUAL
    // activation, only call tabs[next].focus() here and move select()
    // to an Enter/Space handler.
    tabs[next].focus();
    select(tabs[next]);
  });
});`;

const ARIA_ROWS = [
  { target: "Tab list wrapper", attribute: 'role="tablist"', why: "Identifies the group of tab buttons as a tablist, so AT announces the total count and enables tab-specific navigation commands." },
  { target: "Each tab", attribute: 'role="tab" + aria-selected', why: 'Identifies each button as a tab and communicates which one is currently active — announced as "selected."' },
  { target: "Each tab", attribute: "aria-controls", why: "Associates the tab with the panel id it reveals." },
  { target: "Each tab", attribute: "tabIndex (roving)", why: "Only the active/focused tab has tabIndex=0; the rest are -1, so Tab moves from the tablist straight to panel content instead of stopping on every tab." },
  { target: "Each panel", attribute: 'role="tabpanel" + aria-labelledby', why: "Identifies the panel and labels it via the tab that reveals it, so its accessible name matches the tab label." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab", behavior: "Moves focus from the page into the tablist (landing on the active tab), then out to the active panel's content." },
  { keys: "Right / Left Arrow", behavior: "Moves focus to the next / previous tab, wrapping at the ends. In automatic mode, also activates it." },
  { keys: "Home / End", behavior: "Moves focus to the first / last tab." },
  { keys: "Enter / Space", behavior: "In manual activation mode, activates the focused tab. Not needed in automatic mode." },
];

const SR_ROWS = [
  { step: "Focus enters the tablist on the active tab", jawsChrome: "Profile, tab, selected, 1 of 3", nvdaFirefox: "Profile, tab, 1 of 3, selected", voiceOverSafari: "Profile, selected, 1 of 3, tab group" },
  { step: "Right Arrow moves to next tab (automatic activation)", jawsChrome: "Security, tab, selected, 2 of 3", nvdaFirefox: "Security, tab, 2 of 3, selected", voiceOverSafari: "Security, selected, 2 of 3" },
  { step: "Tab key moves from tablist to panel", jawsChrome: "Security panel content, or panel region if labeled", nvdaFirefox: "Security panel content", voiceOverSafari: "Security panel content" },
];

const DEFECTS = [
  { defect: "Tabs built with unlabeled <div>s, no role=\"tablist\"/\"tab\"", severity: "Critical" as const, description: "A screen reader announces each tab as an unrelated clickable element with no indication of a tabbed interface, selection state, or count. Fails SC 4.1.2." },
  { defect: "Every tab is individually Tab-reachable (no roving tabindex)", severity: "Medium" as const, description: "Keyboard users must Tab through every single tab to reach panel content instead of arrowing through tabs and pressing Tab once. Fails SC 2.4.3 in spirit / significant usability defect." },
  { defect: "Arrow keys not implemented", severity: "High" as const, description: "Users relying on the expected tabs interaction model (arrow keys to move between tabs) have no way to do so. Fails SC 2.1.1." },
  { defect: "Panel not associated with its tab via aria-labelledby", severity: "Medium" as const, description: "Panel content has no accessible name tying it back to which tab revealed it, which is disorienting when jumping directly into panel content via landmark/region navigation. Fails SC 4.1.2." },
];

const TEST_STEPS = [
  { action: "Tab to the tab list.", expected: "Focus lands on the currently selected tab; screen reader announces its label, \"tab,\" selected state, and position (e.g. \"1 of 3\")." },
  { action: "Press Right Arrow through all tabs and past the last one.", expected: "Focus moves tab-to-tab, wrapping from the last tab back to the first." },
  { action: "(Automatic activation) Arrow to a different tab.", expected: "The corresponding panel becomes visible immediately, without pressing Enter." },
  { action: "(Manual activation) Arrow to a different tab, then press Enter.", expected: "Panel does not change until Enter/Space is pressed on the focused tab." },
  { action: "Press Tab once from the active tab.", expected: "Focus moves directly to the active panel's content — not to any other tab." },
];

const CHECKLIST = [
  "Tabs can be reached and operated using only the keyboard.",
  "Only one tab is in the natural Tab order at a time (roving tabindex).",
  "Right/Left Arrow move between tabs and wrap at the ends; Home/End jump to first/last.",
  "role=\"tablist\", role=\"tab\", and role=\"tabpanel\" are all present and correctly associated via aria-controls / aria-labelledby.",
  "aria-selected correctly reflects the active tab at all times.",
  "Activation mode (automatic vs. manual) matches what's documented for this instance and is announced consistently.",
  "Panel content is reachable with a single Tab press from the active tab.",
];

export function TabsPageClient() {
  const { mode } = useMode();
  const [activation, setActivation] = React.useState<"automatic" | "manual">(
    "automatic"
  );

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Navigation</Badge>
          <Badge tone="neutral">Flagship guide</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <TabsPattern activationMode={activation} />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "tabs.html", code: HTML_CODE },
                { label: "JS", filename: "tabs.js", code: JS_CODE },
              ]}
            />
          )}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 p-1 text-sm">
          <button
            type="button"
            onClick={() => setActivation("automatic")}
            aria-pressed={activation === "automatic"}
            className={
              "rounded-full px-3 py-1.5 font-medium " +
              (activation === "automatic"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground")
            }
          >
            Automatic activation
          </button>
          <button
            type="button"
            onClick={() => setActivation("manual")}
            aria-pressed={activation === "manual"}
            className={
              "rounded-full px-3 py-1.5 font-medium " +
              (activation === "manual"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground")
            }
          >
            Manual activation
          </button>
        </div>
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <TabsPattern activationMode={activation} />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <TabsPatternBroken />
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
              <li>Tab into the widget lands on the currently active tab, never on an inactive one.</li>
              <li>Arrow keys move focus between tabs using a roving tabindex — never real DOM focus loss.</li>
              <li>Tab out of the tablist moves focus directly to the active panel's content, skipping inactive tabs entirely.</li>
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
