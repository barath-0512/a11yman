import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = pageMetadata({
  title: "Screen Reader Testing Guide",
  description:
    "How to start and stop JAWS, NVDA, and VoiceOver, essential commands, and the difference between browse mode and focus mode.",
  path: "/screen-reader-guide",
});

const SCREEN_READERS = [
  {
    name: "NVDA + Firefox",
    platform: "Windows (free)",
    start: "Ctrl+Alt+N, or launch from the desktop/Start Menu shortcut.",
    stop: "Insert+Q, or Ctrl+Alt+N again to toggle.",
    commands: [
      { key: "Insert+Down Arrow", action: "Start reading continuously from the current position." },
      { key: "Tab / Shift+Tab", action: "Move focus forward/backward (focus mode)." },
      { key: "H / Shift+H", action: "Jump to next/previous heading (browse mode)." },
      { key: "K / Shift+K", action: "Jump to next/previous link (browse mode)." },
      { key: "F / Shift+F", action: "Jump to next/previous form field (browse mode)." },
      { key: "Insert+F7", action: "Open the elements list (links, headings, landmarks)." },
      { key: "Insert+Space", action: "Toggle between browse mode and focus mode." },
    ],
  },
  {
    name: "JAWS + Chrome",
    platform: "Windows (commercial)",
    start: "Launch from the desktop shortcut or Start Menu; JAWS starts speaking on load.",
    stop: "Insert+F4, or exit from the JAWS system tray icon.",
    commands: [
      { key: "Insert+Down Arrow", action: "Say All — read continuously from the current position." },
      { key: "Tab / Shift+Tab", action: "Move focus forward/backward." },
      { key: "H / Shift+H", action: "Jump to next/previous heading." },
      { key: "Insert+F6", action: "Open the headings list." },
      { key: "Insert+F5", action: "Open the form fields list." },
      { key: "Insert+F7", action: "Open the links list." },
      { key: "Insert+Z", action: "Toggle virtual PC cursor (browse mode) on/off." },
    ],
  },
  {
    name: "VoiceOver + Safari",
    platform: "macOS (built in)",
    start: "Cmd+F5, or triple-click the Touch ID / side button on supported Macs.",
    stop: "Cmd+F5 again.",
    commands: [
      { key: "VO (Ctrl+Option) + Right/Left Arrow", action: "Move to the next/previous item in the rotor's linear order." },
      { key: "Tab / Shift+Tab", action: "Move focus forward/backward between interactive elements only." },
      { key: "VO+U", action: "Open the rotor (headings, links, landmarks, form controls)." },
      { key: "VO+Space", action: "Activate the current item." },
      { key: "VO+A", action: "Read all, starting from the current position." },
      { key: "VO+Cmd+H", action: "Jump to next heading (with rotor set to Headings)." },
    ],
  },
];

export default function ScreenReaderGuidePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" tabIndex={-1} className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Screen reader testing guide
            </h1>
            <p className="text-lg text-muted-foreground">
              How to start and stop the three major screen readers, their
              essential commands, and the browse-mode/focus-mode model that
              trips up most first-time testers.
            </p>
            <LastVerified date="2026-07-02" />
          </header>

          <PageSection id="browse-vs-focus" title="Browse mode vs. focus mode">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Browse mode</strong>{" "}
                (NVDA/JAWS on Windows; the default reading mode) lets you
                navigate a page like a document — by heading, link, landmark,
                or single character — using letter-key shortcuts instead of
                Tab. It's how a screen reader user explores static content.
              </p>
              <p>
                <strong className="text-foreground">Focus mode</strong>{" "}
                (sometimes called "forms mode" or "application mode")
                switches keystrokes over to the widget itself — typing "h"
                inside a text field should type the letter H, not jump to a
                heading. Windows screen readers switch into focus mode
                automatically when you Tab into a form field or a
                composite ARIA widget (combobox, menu, slider), and back to
                browse mode when you leave it.
              </p>
              <p>
                <strong className="text-foreground">
                  Why this matters for testing:
                </strong>{" "}
                if your custom widget doesn't trigger the automatic
                mode-switch correctly (usually because required ARIA roles
                are missing), letter-key shortcuts will "leak through" and
                do the wrong thing — this is one of the most common defects
                found in hand-rolled components. VoiceOver on macOS doesn't
                have this same browse/focus split; it uses the rotor and
                Tab/VO-arrow navigation more uniformly.
              </p>
            </div>
          </PageSection>

          <PageSection id="screen-readers" title="Starting, stopping, and essential commands">
            <div className="space-y-6">
              {SCREEN_READERS.map((sr) => (
                <Card key={sr.name}>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium">{sr.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {sr.platform}
                      </p>
                    </div>
                    <dl className="grid gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-medium">Start</dt>
                        <dd className="text-muted-foreground">{sr.start}</dd>
                      </div>
                      <div>
                        <dt className="font-medium">Stop</dt>
                        <dd className="text-muted-foreground">{sr.stop}</dd>
                      </div>
                    </dl>
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full border-collapse text-sm">
                        <caption className="sr-only">
                          {sr.name} essential commands
                        </caption>
                        <thead className="bg-secondary/60 text-left">
                          <tr>
                            <th scope="col" className="px-3 py-2 font-semibold">Command</th>
                            <th scope="col" className="px-3 py-2 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sr.commands.map((c) => (
                            <tr key={c.key} className="border-t border-border">
                              <th scope="row" className="whitespace-nowrap px-3 py-2 font-mono text-xs font-medium">
                                {c.key}
                              </th>
                              <td className="px-3 py-2 text-muted-foreground">
                                {c.action}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageSection>

          <PageSection id="tips" title="Testing tips">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Test with your monitor off, or your eyes closed, at least once per component — it forces you to rely entirely on the announcement, the way a blind user does.</li>
              <li>Always test in the screen reader's most commonly paired browser (NVDA+Firefox, JAWS+Chrome, VoiceOver+Safari) — behavior can differ meaningfully across browser pairings.</li>
              <li>Slow the speech rate down while learning — it's much easier to catch a missing or wrong announcement at a pace you can actually follow.</li>
              <li>Re-test after every fix. ARIA defects are easy to partially fix and leave a related state (e.g. aria-expanded) out of sync.</li>
            </ul>
          </PageSection>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
