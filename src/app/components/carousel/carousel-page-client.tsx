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
import { CarouselPattern } from "@/components/patterns/carousel-pattern";
import { CarouselPatternBroken } from "@/components/patterns/carousel-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("carousel")!;

const CUSTOM_CODE = `function CarouselPattern() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false); // off by default
  const [announcement, setAnnouncement] = useState("");

  function goTo(next, userInitiated) {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
    if (userInitiated) {
      // Never announce pure autoplay ticks — only user-driven changes.
      setAnnouncement(\`Slide \${wrapped + 1} of \${SLIDES.length}: \${SLIDES[wrapped].title}\`);
    }
  }

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Product announcements"
         onKeyDown={e => {
           if (e.key === "ArrowRight") goTo(index + 1, true);
           if (e.key === "ArrowLeft") goTo(index - 1, true);
         }}>
      <div aria-roledescription="slide" aria-label={\`\${index + 1} of \${SLIDES.length}\`}>
        {SLIDES[index].title}
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>
      <button onClick={() => goTo(index - 1, true)} aria-label="Previous slide">‹</button>
      <button onClick={() => goTo(index + 1, true)} aria-label="Next slide">›</button>
      <button onClick={() => setPlaying(p => !p)} aria-pressed={playing}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}`;

const ARIA_ROWS = [
  { target: "Carousel wrapper", attribute: 'role="region" + aria-roledescription="carousel" + aria-label', why: 'There is no native ARIA carousel role, so region + roledescription gives AT a landmark plus a more specific spoken name ("carousel" instead of generic "region").' },
  { target: "Each slide", attribute: 'aria-roledescription="slide" + aria-label="N of M"', why: "Announces each slide's position, so screen reader users always know where they are, independent of visual pagination dots." },
  { target: "Live region", attribute: 'aria-live="polite" + aria-atomic="true", visually hidden', why: "Announces the new slide's title after a user-initiated change. Kept silent during autoplay ticks so it doesn't interrupt users every few seconds." },
  { target: "Pause/Play button", attribute: "aria-pressed", why: "Exposes autoplay state as a toggle button. Must always be present and operable whenever autoplay can run — required by SC 2.2.2." },
  { target: "Previous / Next buttons", attribute: 'aria-label="Previous slide" / "Next slide"', why: "Gives icon-only buttons an accessible name, since a chevron glyph alone has none." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves through the active slide's content, then the Previous/Next/Pause controls, then out to the next page element. Inactive slides are never in the tab order." },
  { keys: "Left / Right Arrow (focus within region)", behavior: "Moves to the previous / next slide. Also acceptable per APG to rely on the dedicated Previous/Next buttons alone, operable via Tab + Enter." },
  { keys: "Enter / Space (on Previous, Next, or Pause/Play button)", behavior: "Activates that control." },
];

const SR_ROWS = [
  { step: "Focus enters the carousel region", jawsChrome: "Product announcements, carousel", nvdaFirefox: "Product announcements, carousel", voiceOverSafari: "Product announcements, carousel" },
  { step: "Slide content is read", jawsChrome: "1 of 4, slide, New: Team workspaces…", nvdaFirefox: "1 of 4, slide, New: Team workspaces…", voiceOverSafari: "New: Team workspaces…, 1 of 4, slide" },
  { step: "User presses Next", jawsChrome: "Slide 2 of 4: Faster search (announced via live region)", nvdaFirefox: "Slide 2 of 4: Faster search (announced via live region)", voiceOverSafari: "Slide 2 of 4: Faster search (announced via live region)" },
  { step: "Autoplay tick fires (no user action)", jawsChrome: "(silent — nothing announced)", nvdaFirefox: "(silent — nothing announced)", voiceOverSafari: "(silent — nothing announced)" },
];

const DEFECTS = [
  { defect: "Autoplay with no pause/stop control", severity: "Critical" as const, description: "Content changes automatically every few seconds with no way for the user to stop it, making it impossible for anyone needing more time to read a slide before it changes. Fails SC 2.2.2 Pause, Stop, Hide." },
  { defect: "No live region announcing slide changes", severity: "High" as const, description: "Screen reader users navigating by controls get no confirmation the slide changed or what the new content is; they must manually re-explore the region after every click. Fails SC 4.1.3 Status Messages." },
  { defect: "Previous/Next built from <div onClick>", severity: "Critical" as const, description: "Controls are not focusable and have no keyboard activation, so keyboard-only users cannot navigate the carousel at all — nor pause it, compounding the autoplay defect. Fails SC 2.1.1 and 4.1.2." },
  { defect: "Live region announces on every autoplay tick", severity: "Medium" as const, description: "If a live region is present but fires on autoplay too (not shown in the broken demo above, but common in the wild), screen reader users get interrupted every few seconds regardless of whether they're reading something else. Treat as a defect distinct from having no live region at all." },
];

const TEST_STEPS = [
  { action: "Load the page and wait 10 seconds without interacting.", expected: "If autoplay is on, a visible, focusable Pause control is present and content does not change in a way that can't be stopped." },
  { action: "Tab to the Previous/Next/Pause controls.", expected: "Each receives visible focus and is announced with an accessible name (not just an icon)." },
  { action: "Press Next several times.", expected: "The slide changes each time, and the live region announces the new slide's position and title." },
  { action: "Press the Pause button, then wait.", expected: "Autoplay stops; the slide no longer changes on its own, and the button now announces \"Play.\"" },
  { action: "Tab through the carousel region end to end.", expected: "Focus visits the active slide's content and the controls, then moves to the next element on the page — it never lands on hidden/inactive slides and never gets trapped." },
];

const CHECKLIST = [
  "Autoplay defaults to off, or is trivially and immediately pausable via a visible control.",
  "A Pause/Play (or Stop) control is present at all times whenever autoplay can run — SC 2.2.2.",
  "Previous and Next are real, keyboard-operable buttons with accessible names.",
  "The carousel region has role=\"region\", aria-roledescription=\"carousel\", and a meaningful aria-label.",
  "Each slide has aria-roledescription=\"slide\" and an aria-label announcing its position (e.g. \"2 of 4\").",
  "A polite, atomic live region announces user-initiated slide changes — and stays silent during autoplay ticks.",
  "Tab does not trap focus inside the carousel and never lands on inactive/off-screen slide content.",
  "Left/Right Arrow keys move between slides when focus is within the region (or Previous/Next buttons alone are fully sufficient).",
];

export function CarouselPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">Overlays</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <CarouselPattern />
          {mode === "developer" && <CodeBlock code={CUSTOM_CODE} filename="carousel-pattern.tsx" />}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <CarouselPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <CarouselPatternBroken />
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
              <li>Only the active slide's content is in the Tab order — inactive slides are never reachable, avoiding focus landing on off-screen content.</li>
              <li>Tab moves through the active slide, then the Previous/Next/Pause controls, then continues to the next element on the page — the region never traps focus.</li>
              <li>Changing slides via a control never forcibly moves keyboard focus away from that control.</li>
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
