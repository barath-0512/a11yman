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
import { MenuButtonPattern } from "@/components/patterns/menu-button-pattern";
import { MenuButtonPatternBroken } from "@/components/patterns/menu-button-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("menu-button")!;

const HTML_CODE = `<button id="menu-btn" aria-haspopup="menu" aria-expanded="false"
        aria-controls="actions-menu">
  Actions
</button>

<!-- Menu items are real <button>s inside role="none" <li>s. They are
     tabindex="-1"; focus is managed with the arrow keys, not Tab. The
     menu starts hidden. -->
<ul id="actions-menu" role="menu" aria-label="Actions" hidden>
  <li role="none"><button role="menuitem" tabindex="-1">Rename</button></li>
  <li role="none"><button role="menuitem" tabindex="-1">Duplicate</button></li>
  <li role="none"><button role="menuitem" tabindex="-1">Delete</button></li>
</ul>`;

const JS_CODE = `const button = document.getElementById("menu-btn");
const menu = document.getElementById("actions-menu");
const items = [...menu.querySelectorAll('[role="menuitem"]')];

function openMenu(index) {
  menu.hidden = false;
  button.setAttribute("aria-expanded", "true");
  items[index].focus(); // move focus into the menu
}

function closeMenu({ restoreFocus }) {
  menu.hidden = true;
  button.setAttribute("aria-expanded", "false");
  if (restoreFocus) button.focus();
}

// Open from the trigger: ArrowDown/Enter focus the first item, ArrowUp
// the last. Click toggles.
button.addEventListener("click", () => {
  menu.hidden ? openMenu(0) : closeMenu({ restoreFocus: false });
});
button.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); openMenu(0); }
  if (e.key === "ArrowUp") { e.preventDefault(); openMenu(items.length - 1); }
});

items.forEach((item, i) => {
  item.addEventListener("click", () => closeMenu({ restoreFocus: true }));
  item.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if (e.key === "Home") { e.preventDefault(); items[0].focus(); }
    if (e.key === "End") { e.preventDefault(); items[items.length - 1].focus(); }
    if (e.key === "Escape") { e.preventDefault(); closeMenu({ restoreFocus: true }); }
    if (e.key === "Tab") closeMenu({ restoreFocus: false }); // menus aren't modal
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); item.click(); }
  });
});`;

const ARIA_ROWS = [
  { target: "Trigger <button>", attribute: 'aria-haspopup="menu"', why: 'Tells AT this button opens a menu, so it can announce "has popup, menu" before it\'s even activated.' },
  { target: "Trigger <button>", attribute: "aria-expanded", why: "Communicates the menu's open/closed state on the trigger itself." },
  { target: "Trigger <button>", attribute: "aria-controls", why: "Associates the trigger with the menu it opens, by id." },
  { target: "Menu container", attribute: 'role="menu"', why: 'Identifies the popup as a menu (not a generic list), enabling menu-specific AT navigation and the "menu" role announcement.' },
  { target: "Each item", attribute: 'role="menuitem", tabIndex="-1"', why: "Identifies each row as an actionable menu item; tabIndex=-1 keeps items out of the page Tab order — they're reached only via the menu's own arrow-key roving focus." },
];

const KEYBOARD_ROWS = [
  { keys: "Enter / Space / Down Arrow (on button)", behavior: "Opens the menu and moves focus to the first item." },
  { keys: "Up Arrow (on button)", behavior: "Opens the menu and moves focus to the last item." },
  { keys: "Down / Up Arrow (in menu)", behavior: "Moves focus to the next / previous item, wrapping at the ends." },
  { keys: "Home / End", behavior: "Moves focus to the first / last item." },
  { keys: "Enter / Space (on item)", behavior: "Activates the item and closes the menu, returning focus to the button." },
  { keys: "Escape", behavior: "Closes the menu and returns focus to the button." },
  { keys: "Tab", behavior: "Closes the menu (it is not modal) and moves focus to the next focusable element on the page." },
];

const SR_ROWS = [
  { step: "Focus on the closed trigger button", jawsChrome: "Actions, button, has popup, menu, collapsed", nvdaFirefox: "Actions, button, subMenu, collapsed", voiceOverSafari: "Actions, menu button, collapsed" },
  { step: "Menu opens, focus moves to first item", jawsChrome: "New file, menu item, 1 of 4", nvdaFirefox: "New file, menu item, 1 of 4", voiceOverSafari: "New file, menu item, 1 of 4" },
  { step: "Down Arrow moves to next item", jawsChrome: "Duplicate, menu item, 2 of 4", nvdaFirefox: "Duplicate, menu item, 2 of 4", voiceOverSafari: "Duplicate, menu item, 2 of 4" },
  { step: "Escape closes the menu", jawsChrome: "Actions, button, collapsed", nvdaFirefox: "Actions, button, collapsed", voiceOverSafari: "Actions, menu button, collapsed" },
];

const DEFECTS = [
  { defect: "Missing role=\"menu\"/\"menuitem\" and aria-haspopup", severity: "Critical" as const, description: "The popup reads as an unstructured list of clickable text; screen reader users get no indication a menu exists, how many items it has, or that this is a menu at all. Fails SC 4.1.2." },
  { defect: "No arrow-key navigation between items", severity: "High" as const, description: "Keyboard users can only reach items by tabbing through each one individually (if they're focusable at all), rather than the expected arrow-key menu model. Fails SC 2.1.1." },
  { defect: "Escape does not close the menu / focus not restored to trigger", severity: "High" as const, description: "Keyboard users have no reliable way to dismiss the menu, and closing it (by other means) leaves focus stranded instead of returning to the Actions button. Fails SC 2.1.1 and 2.4.3." },
  { defect: "Menu items are plain <div>s with onClick only", severity: "Critical" as const, description: "Items have no keyboard activation path (no Enter/Space handling, not natively focusable), making every action in the menu unreachable without a mouse. Fails SC 2.1.1 and 4.1.2." },
];

const TEST_STEPS = [
  { action: "Tab to the Actions button.", expected: "Screen reader announces the label, button role, \"has popup, menu,\" and collapsed state." },
  { action: "Press Enter or Down Arrow.", expected: "Menu opens; focus moves to the first menu item, announced with its position (e.g. \"1 of 4\")." },
  { action: "Press Down Arrow through all items and past the last.", expected: "Focus cycles through items, wrapping from the last back to the first." },
  { action: "Press Escape.", expected: "Menu closes; focus returns to the Actions button, which is announced as collapsed again." },
  { action: "Reopen the menu and press Tab.", expected: "Menu closes and focus moves to the next focusable element on the page (not trapped, not returned to the button)." },
  { action: "Reopen the menu and press Enter on an item.", expected: "The item activates, the menu closes, and focus returns to the Actions button." },
];

const CHECKLIST = [
  "Menu can be opened, navigated, and an item activated using only the keyboard.",
  "aria-haspopup=\"menu\" and aria-expanded are present on the trigger and accurate at all times.",
  "role=\"menu\" and role=\"menuitem\" are present and correctly structured (menuitems inside the menu, role=\"none\" on any wrapping <li>).",
  "Down Arrow on the closed button opens the menu and focuses the first item; Up Arrow focuses the last item.",
  "Arrow keys move focus between items inside the open menu, wrapping at the ends.",
  "Escape closes the menu and returns focus to the trigger button.",
  "Tab closes the menu (non-modal) and continues to the next page element.",
  "Activating an item closes the menu and returns focus to the trigger button.",
];

export function MenuButtonPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Overlays</Badge>
          <Badge tone="neutral">Flagship guide</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <MenuButtonPattern />
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "menu-button.html", code: HTML_CODE },
                { label: "JS", filename: "menu-button.js", code: JS_CODE },
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
              <MenuButtonPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <MenuButtonPatternBroken />
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
              <li>Opening via Down Arrow focuses the first item; via Up Arrow focuses the last item.</li>
              <li>Menu items use a roving tabindex (all -1) — arrow keys move real focus between them directly.</li>
              <li>Escape or activating an item closes the menu and restores focus to the trigger button.</li>
              <li>Tab closes the menu without restoring focus to the trigger — it continues the page's natural tab sequence, since menus are not modal.</li>
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
