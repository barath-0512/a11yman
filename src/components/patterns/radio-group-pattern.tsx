"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "standard", label: "Standard", meta: "5–7 business days · Free" },
  { id: "express", label: "Express", meta: "2–3 business days · $12" },
  { id: "overnight", label: "Overnight", meta: "Next business day · $28" },
];

/**
 * Hand-coded APG "Radio Group" pattern, used only when the design needs
 * fully custom-styled selectable cards that a native <input type="radio">
 * can't visually achieve. For anything else, prefer native radios — see
 * the Native tab; arrow-key roving is automatic there and has to be
 * hand-built here.
 */
export function RadioGroupPattern() {
  const [selected, setSelected] = React.useState("standard");
  const optionRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function select(id: string) {
    setSelected(id);
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    // Radio groups select-on-arrow: unlike tabs (where automatic vs.
    // manual activation is a design choice), arrowing through a radio
    // group must both MOVE focus and CHANGE the selection immediately —
    // this matches native <input type="radio"> arrow-key behavior.
    let nextIndex: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      nextIndex = (index + 1) % OPTIONS.length;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      nextIndex = (index - 1 + OPTIONS.length) % OPTIONS.length;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const next = OPTIONS[nextIndex];
      setSelected(next.id);
      optionRefs.current[next.id]?.focus();
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      select(OPTIONS[index].id);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Shipping speed"
      className="w-full max-w-sm space-y-2"
    >
      {OPTIONS.map((option, i) => {
        const checked = selected === option.id;
        return (
          <button
            key={option.id}
            ref={(el) => {
              optionRefs.current[option.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            // Roving tabindex: only the checked option (or the first
            // option, before any selection) is a Tab stop. Every other
            // option is reached by arrow keys, never by Tab — this mirrors
            // how native radios in the same `name` group behave.
            tabIndex={checked ? 0 : -1}
            onClick={() => select(option.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition-colors",
              checked
                ? "border-accent bg-accent/10"
                : "border-border bg-card hover:bg-secondary/40"
            )}
          >
            <span>
              <span className="block text-sm font-medium">{option.label}</span>
              <span className="block text-xs text-muted-foreground">{option.meta}</span>
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                checked ? "border-accent" : "border-border"
              )}
            >
              {checked && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
