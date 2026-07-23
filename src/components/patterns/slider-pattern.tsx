"use client";

import * as React from "react";

const MIN = 0;
const MAX = 100;
const STEP = 1;
const BIG_STEP = 10; // Page Up/Down move 10x the normal step.

/**
 * Hand-coded APG "Slider" pattern — a volume control, 0-100.
 *
 * role="slider" on the focusable thumb, plus aria-valuemin/max/now, is what
 * lets AT announce this as a slider with its current numeric value. Arrow
 * keys satisfy SC 2.5.7 Dragging Movements by giving keyboard users a way
 * to reach any value without dragging; clicking directly on the track gives
 * pointer users the same single-pointer (non-drag) alternative.
 */
export function SliderPattern() {
  const [value, setValue] = React.useState(60);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const draggingRef = React.useRef(false);

  function clamp(v: number) {
    return Math.max(MIN, Math.min(MAX, v));
  }

  function setFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setValue(clamp(Math.round(MIN + ratio * (MAX - MIN))));
  }

  function onTrackPointerDown(e: React.PointerEvent) {
    // Single-pointer, non-drag alternative required by SC 2.5.7: a single
    // click/tap anywhere on the track jumps the thumb straight to that
    // value — no press-and-drag gesture required to reach any value.
    setFromClientX(e.clientX);
    thumbRef.current?.focus();
    draggingRef.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setValue((v) => clamp(v + STEP));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setValue((v) => clamp(v - STEP));
    } else if (e.key === "PageUp") {
      e.preventDefault();
      setValue((v) => clamp(v + BIG_STEP));
    } else if (e.key === "PageDown") {
      e.preventDefault();
      setValue((v) => clamp(v - BIG_STEP));
    } else if (e.key === "Home") {
      e.preventDefault();
      setValue(MIN);
    } else if (e.key === "End") {
      e.preventDefault();
      setValue(MAX);
    }
  }

  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="w-72">
      <div className="mb-1.5 flex items-center justify-between">
        <label id="slider-pattern-volume-label" htmlFor="slider-pattern-thumb" className="text-sm font-medium">
          Volume
        </label>
        <span className="text-sm text-muted-foreground" aria-hidden="true">
          {value}%
        </span>
      </div>
      <div
        ref={trackRef}
        onPointerDown={onTrackPointerDown}
        className="relative h-2 w-full cursor-pointer rounded-full bg-secondary"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          style={{ width: `${percent}%` }}
        />
        <div
          ref={thumbRef}
          id="slider-pattern-thumb"
          role="slider"
          tabIndex={0}
          aria-labelledby="slider-pattern-volume-label"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={value}
          aria-valuetext={`${value}%`}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-accent bg-card shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}
