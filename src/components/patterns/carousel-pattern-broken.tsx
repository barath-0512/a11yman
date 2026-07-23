"use client";

import * as React from "react";

const SLIDES = [
  { id: "s1", title: "New: Team workspaces", body: "Share projects with your whole team in one shared space." },
  { id: "s2", title: "Faster search", body: "Full-text search now returns results in under 100ms." },
  { id: "s3", title: "Dark mode", body: "Switch themes from the account menu, or follow your system setting." },
];

/**
 * ⚠ Deliberately broken carousel — for learning only.
 *
 * Defects, on purpose:
 * 1. Autoplay starts immediately on mount and CANNOT be paused or
 *    stopped — there is no pause control at all. Content changes every
 *    3 seconds indefinitely. Fails SC 2.2.2 Pause, Stop, Hide.
 * 2. No live region — slide changes (whether from autoplay or the
 *    Previous/Next controls) are never announced to screen reader users,
 *    who have no way to know the content changed. Fails SC 4.1.3.
 * 3. Previous/Next are <div onClick> elements — not focusable and not
 *    keyboard-operable, so keyboard users cannot control the carousel at
 *    all even if they could pause it. Fails SC 2.1.1.
 */
export function CarouselPatternBroken() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-5">
      <div className="min-h-[96px]">
        <h3 className="text-base font-semibold">{slide.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{slide.body}</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-sm"
        >
          ‹
        </div>
        <div
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-sm"
        >
          ›
        </div>
      </div>
    </div>
  );
}
