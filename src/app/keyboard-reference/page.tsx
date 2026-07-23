import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { KeyboardTable } from "@/components/reference/keyboard-table";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";

export const metadata = pageMetadata({
  title: "Keyboard Testing Quick Reference",
  description:
    "Global keyboard shortcut legend and conventions for accessibility testing: Tab, Shift+Tab, Enter, Space, Arrows, Home/End, Escape.",
  path: "/keyboard-reference",
});

const GLOBAL_ROWS = [
  { keys: "Tab", behavior: "Moves focus to the next focusable element in DOM/visual order." },
  { keys: "Shift+Tab", behavior: "Moves focus to the previous focusable element." },
  { keys: "Enter", behavior: "Activates the focused link or button; submits the focused form." },
  { keys: "Space", behavior: "Activates the focused button, toggles the focused checkbox/switch, or scrolls the page if focus is on the document body." },
  { keys: "Arrow keys", behavior: "Move selection/focus within a composite widget (menu, tablist, listbox, radio group, slider) — never used for page-level navigation." },
  { keys: "Home / End", behavior: "Move to the first / last item within a composite widget, or the top/bottom of a scrollable region." },
  { keys: "Escape", behavior: "Dismisses a transient UI element (menu, dialog, tooltip, popover) without committing a change, and returns focus to a sensible place." },
  { keys: "Page Up / Page Down", behavior: "Scrolls a large view (e.g. a slider or scrollable list) by a larger increment." },
];

const RULES = [
  "Arrow keys operate only inside a single composite widget — they should never move focus to a different, unrelated widget on the page.",
  "Anything a mouse can activate must also be reachable and activatable by keyboard alone (SC 2.1.1).",
  "Focus must never become trapped in a region a user can't Tab or Escape their way out of, except intentionally inside an open modal dialog (SC 2.1.2).",
  "Tab order should follow visual/reading order — components positioned visually later shouldn't receive focus earlier (SC 2.4.3).",
  "A visible focus indicator (2px minimum, 3:1 contrast against its background) must be present on every focusable element (SC 2.4.7).",
];

export default function KeyboardReferencePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Keyboard testing quick reference
            </h1>
            <p className="text-lg text-muted-foreground">
              The conventions used throughout this site's component pages,
              and the general rules to check any custom widget against.
            </p>
            <LastVerified date="2026-07-02" />
          </header>

          <PageSection id="legend" title="Global keyboard shortcut legend">
            <KeyboardTable rows={GLOBAL_ROWS} />
          </PageSection>

          <PageSection id="rules" title="General testing rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </PageSection>

          <PageSection id="how-to-test" title="How to run a keyboard-only pass">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Unplug or ignore your mouse/trackpad for the entire pass.</li>
              <li>Starting from the browser address bar, press Tab repeatedly through the whole page.</li>
              <li>At every stop, confirm you can see where focus is (SC 2.4.7) and that the order makes sense (SC 2.4.3).</li>
              <li>For every interactive control, try to complete its task using only keyboard keys documented on that component's page.</li>
              <li>Confirm you can always get back out — no dead ends, no traps.</li>
            </ol>
          </PageSection>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
