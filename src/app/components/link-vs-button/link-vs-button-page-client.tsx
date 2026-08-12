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
import { LinkVsButtonPatternBroken } from "@/components/patterns/link-vs-button-pattern-broken";
import { NativeLinkVsButtonPattern } from "@/components/patterns/native-link-vs-button-pattern";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("link-vs-button")!;

const HTML_CODE = `<!-- Navigation → a real link. Correct role, Tab-focusable, Enter to
     follow, and it works with middle-click / "open in new tab". -->
<a href="/pricing">View pricing</a>

<!-- In-page action → a real button. Correct role, Enter AND Space to
     activate, and it never navigates. -->
<button type="button" id="add-to-cart">Add to cart</button>`;

const JS_CODE = `// A link needs no JS — the browser handles navigation. Only the
// in-page action does. Never bolt a click handler onto an <a> to
// fake a button, or a navigation onto a <button>: keep role and
// behaviour in sync.
document.getElementById("add-to-cart").addEventListener("click", () => {
  // ...add the item to the cart
});`;

const ARIA_ROWS = [
  { target: "Navigation control", attribute: "<a href> (native)", why: "The browser provides link role, accessible name from text content, Tab focusability, and Enter-to-activate — no ARIA required." },
  { target: "Action control", attribute: "<button type=\"button\"> (native)", why: "The browser provides button role, accessible name, Tab focusability, and both Enter- and Space-to-activate — no ARIA required." },
  { target: "Reimplemented link (if you must)", attribute: 'role="link" + tabIndex={0} + Enter keydown', why: "Every one of these three pieces is required to match native <a> behavior; omitting any one silently breaks keyboard/AT access." },
  { target: "Reimplemented button (if you must)", attribute: 'role="button" + tabIndex={0} + Enter/Space keydown', why: "A custom button must handle both Enter and Space — native <button> does, and testers should check for both, not just one." },
];

const KEYBOARD_ROWS = [
  { keys: "Enter (on a link)", behavior: "Activates a native <a href>, navigating to its destination. This is the only key a real link responds to." },
  { keys: "Enter or Space (on a button)", behavior: "Activates a native <button>, performing its action. Real buttons respond to both keys — testers should verify both, not just one." },
  { keys: "Tab / Shift+Tab", behavior: "Moves focus to/from links and buttons normally, since both are natively focusable elements." },
  { keys: "(any key, on a div/span with only onClick)", behavior: "Nothing happens — an element with no role, no tabIndex, and no keydown handler cannot receive focus or respond to any key at all." },
];

const SR_ROWS = [
  { step: "Focus lands on a correct <a href>", jawsChrome: "View pricing, link", nvdaFirefox: "View pricing, link", voiceOverSafari: "View pricing, link" },
  { step: "Focus lands on a correct <button>", jawsChrome: "Add to cart, button", nvdaFirefox: "Add to cart, button", voiceOverSafari: "Add to cart, button" },
  { step: "Tab reaches a broken <div onClick>", jawsChrome: "(skipped entirely — not announced, not focusable)", nvdaFirefox: "(skipped entirely — not announced, not focusable)", voiceOverSafari: "(skipped entirely — not announced, not focusable)" },
  { step: "Focus lands on an <a href=\"#\"> misused as a button", jawsChrome: "Remove item, link", nvdaFirefox: "Remove item, link", voiceOverSafari: "Remove item, link — promises navigation it never performs" },
];

const DEFECTS = [
  { defect: "<div onClick> used for an action (fake button)", severity: "Critical" as const, description: "Not focusable, no role announced, and does not respond to Enter or Space — completely unreachable and unusable by keyboard or screen reader. Fails SC 2.1.1 and 4.1.2. This is the single most common real-world accessibility defect pattern." },
  { defect: "<span onClick> used for navigation (fake link)", severity: "Critical" as const, description: "Same failure mode as the fake button above, but for a navigation control: no focus, no role, no keyboard activation, and the URL never changes so the browser's back button and \"open in new tab\" are silently broken. Fails SC 2.1.1 and 4.1.2." },
  { defect: "<a href=\"#\"> with preventDefault() used purely as a button", severity: "Medium" as const, description: "The \"wrong direction\" mistake: technically keyboard-operable, but announced as a link that promises navigation and never delivers it, pollutes browser history with # entries, and breaks \"open in new tab\"/\"copy link address.\" Flag as a defect even though it's keyboard-reachable." },
  { defect: "Custom role=\"button\" reimplementation missing Space key support", severity: "High" as const, description: "A common half-finished reimplementation wires up Enter but forgets Space, so keyboard users familiar with native button behavior find the control inconsistently operable. Fails SC 4.1.2 Name, Role, Value (behavior doesn't match announced role)." },
];

const TEST_STEPS = [
  { action: "Tab to a control that navigates to a new URL.", expected: "It is announced with the link role, and activating it with Enter changes the URL / navigates." },
  { action: "Tab to a control that performs an action without changing the URL.", expected: "It is announced with the button role, and activating it with EITHER Enter or Space performs the action." },
  { action: "Tab through a page containing a <div onClick> or <span onClick> control.", expected: "Focus skips over it entirely — it is never reachable, which is itself the defect to flag." },
  { action: "Right-click (or long-press) a real navigation link.", expected: "\"Open in new tab\" and \"Copy link address\" work correctly, because it's a genuine <a href>." },
  { action: "Right-click an <a href=\"#\"> being misused as a button.", expected: "\"Open in new tab\" opens a blank/broken page and \"Copy link address\" copies a useless #, confirming the anti-pattern." },
];

const CHECKLIST = [
  "Every control that changes the URL / navigates is a real <a href> (or reimplements role=\"link\" + tabIndex + Enter handling in full).",
  "Every control that performs an in-page action is a real <button> (or reimplements role=\"button\" + tabIndex + Enter AND Space handling in full).",
  "No <div> or <span> with only an onClick handler is used as an interactive control.",
  "No <a href=\"#\"> or <a href=\"javascript:void(0)\"> is used purely as a button substitute.",
  "Right-click \"open in new tab\" and \"copy link address\" work on every actual navigation control.",
  "Custom role-based reimplementations (where unavoidable) respond to every key a native equivalent would.",
];

export function LinkVsButtonPageClient() {
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
          <NativeLinkVsButtonPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "link-vs-button.html", code: HTML_CODE },
                { label: "JS", filename: "link-vs-button.js", code: JS_CODE },
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
              <NativeLinkVsButtonPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <LinkVsButtonPatternBroken />
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
              <li>Both links and buttons must be reachable via Tab in the same order they appear visually — never skipped, never trapped.</li>
              <li>Activating a link navigates the page; focus resets naturally to the top of the destination document.</li>
              <li>Activating a button performs its action in place without moving focus away from the button, unless the action itself opens new content (e.g. a dialog) that should receive focus.</li>
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
