"use client";

import * as React from "react";

const MIN = 0;
const MAX = 100;

/**
 * ⚠ Deliberately broken slider — for learning only.
 *
 * Defects, on purpose:
 * 1. The thumb is a plain <div> with no role="slider" and no
 *    aria-valuemin/max/now — a screen reader announces nothing meaningful
 *    when it receives focus (and it usually can't receive focus at all).
 *    Fails SC 4.1.2 Name, Role, Value.
 * 2. The thumb has no tabIndex, so it is not in the keyboard Tab order at
 *    all — keyboard users cannot even reach the control. Fails SC 2.1.1.
 * 3. No onKeyDown handler — even if a sighted developer tabs to it via
 *    devtools, arrow keys do nothing. There is no non-drag way to change
 *    the value. Fails SC 2.1.1 and SC 2.5.7 Dragging Movements.
 * 4. Value only changes via mouse drag (pointermove while the mouse button
 *    is held) — there is no click-on-track jump and no keyboard path,
 *    so a motor-impaired mouse user who can click but not drag precisely
 *    is also locked out.
 */
export function SliderPatternBroken() {
  const [value, setValue] = React.useState(60);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  function setFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setValue(Math.max(MIN, Math.min(MAX, Math.round(MIN + ratio * (MAX - MIN)))));
  }

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (draggingRef.current) setFromClientX(e.clientX);
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="w-72">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-medium">Volume</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <div ref={trackRef} className="relative h-2 w-full rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: `${percent}%` }} />
        {/* No role, no aria-value*, no tabIndex, no onKeyDown. */}
        <div
          onPointerDown={() => {
            draggingRef.current = true;
          }}
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-accent bg-card shadow-soft-lg"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}
