"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const SLIDES = [
  { id: "s1", title: "New: Team workspaces", body: "Share projects with your whole team in one shared space." },
  { id: "s2", title: "Faster search", body: "Full-text search now returns results in under 100ms." },
  { id: "s3", title: "Dark mode", body: "Switch themes from the account menu, or follow your system setting." },
  { id: "s4", title: "Export to PDF", body: "Every report can now be exported as a print-ready PDF." },
];

/**
 * Hand-coded APG "Carousel" pattern.
 *
 * Key decisions, and why:
 *  - role="region" + aria-roledescription="carousel" on the wrapper names
 *    this as a carousel landmark, since there's no native ARIA "carousel"
 *    role — roledescription lets us borrow region's landmark behavior
 *    while giving AT a more specific spoken label.
 *  - Each slide gets aria-roledescription="slide" and an aria-label like
 *    "2 of 4" so a screen reader user always knows their position.
 *  - A visually-hidden aria-live="polite" region announces the new slide's
 *    title ONLY when the user changes slides via Previous/Next — never
 *    during autoplay ticks, which would be read aloud every few seconds
 *    and be extremely disruptive to screen reader users.
 *  - Autoplay defaults to OFF. If turned on, a visible Pause/Play button
 *    is always present, satisfying SC 2.2.2 Pause, Stop, Hide (any
 *    auto-updating content lasting >5s and starting automatically must be
 *    pausable by the user).
 *  - Only the active slide's interactive content is reachable by Tab;
 *    inactive slides are inert (hidden), so Tab moves through the visible
 *    slide, then the controls, then out to the next page element — it
 *    never traps focus and never lands on off-screen slides.
 */
export function CarouselPattern() {
  const [index, setIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false); // off by default — see SC 2.2.2 note above
  const [announcement, setAnnouncement] = React.useState("");
  const regionRef = React.useRef<HTMLDivElement>(null);

  const goTo = React.useCallback((next: number, userInitiated: boolean) => {
    const wrapped = (next + SLIDES.length) % SLIDES.length;
    setIndex(wrapped);
    if (userInitiated) {
      // Only user-initiated changes are announced — autoplay ticks stay
      // silent so the live region doesn't interrupt every few seconds.
      setAnnouncement(`Slide ${wrapped + 1} of ${SLIDES.length}: ${SLIDES[wrapped].title}`);
    }
  }, []);

  React.useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [playing]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1, true);
    }
  }

  const slide = SLIDES[index];

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Product announcements"
      onKeyDown={onKeyDown}
      className="w-full max-w-xl rounded-2xl border border-border bg-card p-5"
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${SLIDES.length}`}
        className="min-h-[96px]"
      >
        <h3 className="text-base font-semibold">{slide.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{slide.body}</p>
      </div>

      {/* Visually-hidden live region: announces slide changes triggered by
          the user, never during pure autoplay. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1, true)}
            aria-label="Previous slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1, true)}
            aria-label="Next slide"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
          {/* Visible, always-present pause/play control — required by
              SC 2.2.2 whenever autoplay can be running. */}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={playing}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium"
          >
            {playing ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
            {playing ? "Pause" : "Play"}
          </button>
        </div>
        <div className="flex items-center" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1} of ${SLIDES.length}`}
              onClick={() => goTo(i, true)}
              // 24x24 hit target (SC 2.5.8) with a small 10px visual dot
              // centered inside it, so the touch/click area is generous
              // even though the dot itself stays visually compact.
              className="flex h-6 w-6 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={
                  "h-2.5 w-2.5 rounded-full " +
                  (i === index ? "bg-accent" : "bg-border")
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
