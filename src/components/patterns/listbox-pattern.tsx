"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = ["Relevance", "Newest first", "Oldest first", "Price: low to high", "Price: high to low"];

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "Swift", "Kotlin"];

/**
 * Hand-coded APG "Listbox" pattern — single-select.
 *
 * Selection follows focus: moving the roving-tabindex cursor with the arrow
 * keys immediately changes the selected option, mirroring how a native
 * <select> behaves. role="listbox" + role="option" + aria-selected tell AT
 * this is a selectable list rather than a generic list of static text.
 */
export function ListboxPattern() {
  const [selected, setSelected] = React.useState(0);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const listboxId = "listbox-pattern-sort";

  function moveTo(index: number) {
    const clamped = Math.max(0, Math.min(index, SORT_OPTIONS.length - 1));
    setSelected(clamped);
    optionRefs.current[clamped]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveTo(selected + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveTo(selected - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      moveTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveTo(SORT_OPTIONS.length - 1);
    }
    // Nice-to-have: typeahead-by-first-letter could jump `selected` to the
    // next option whose label starts with the typed character. Omitted here
    // to keep the demo focused, but real implementations should include it.
  }

  return (
    <div className="w-72">
      <span id="listbox-pattern-sort-label" className="mb-1.5 block text-sm font-medium">
        Sort by
      </span>
      <ul
        id={listboxId}
        role="listbox"
        aria-labelledby="listbox-pattern-sort-label"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="max-h-56 overflow-auto rounded-lg border border-border bg-card p-1 text-sm"
      >
        {SORT_OPTIONS.map((option, i) => (
          <li
            key={option}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            id={`listbox-pattern-sort-option-${i}`}
            role="option"
            aria-selected={i === selected}
            // Roving tabindex: only the selected option is a Tab stop; the
            // rest are reachable via arrow keys once the list has focus.
            tabIndex={i === selected ? 0 : -1}
            onClick={() => moveTo(i)}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md px-3 py-2",
              i === selected ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
            )}
          >
            {option}
            {i === selected && <Check className="h-4 w-4" aria-hidden="true" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Hand-coded APG "Listbox" pattern — multi-select.
 *
 * Unlike single-select, moving focus does NOT change selection here: arrow
 * keys move a roving-tabindex cursor only, Space toggles the focused
 * option's selection, and Shift+Down/Up extends a contiguous selection
 * range from the last toggled option. aria-multiselectable="true" tells AT
 * that more than one option may be selected at once, and each option's own
 * aria-selected communicates whether it individually is selected.
 */
export function MultiListboxPattern() {
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<Set<number>>(new Set([0, 2]));
  const anchorRef = React.useRef(0);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);
  const listboxId = "listbox-pattern-languages";

  function moveFocus(index: number) {
    const clamped = Math.max(0, Math.min(index, LANGUAGES.length - 1));
    setFocusIndex(clamped);
    optionRefs.current[clamped]?.focus();
    return clamped;
  }

  function toggle(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
    anchorRef.current = index;
  }

  function selectRange(from: number, to: number) {
    const [lo, hi] = from < to ? [from, to] : [to, from];
    setSelected((prev) => {
      const next = new Set(prev);
      for (let i = lo; i <= hi; i++) next.add(i);
      return next;
    });
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = moveFocus(focusIndex + 1);
      if (e.shiftKey) selectRange(anchorRef.current, next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = moveFocus(focusIndex - 1);
      if (e.shiftKey) selectRange(anchorRef.current, next);
    } else if (e.key === " ") {
      e.preventDefault();
      toggle(focusIndex);
    } else if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey)) {
      // Select-all. Kept simple for the demo — a production implementation
      // should also support Ctrl/Cmd+Shift+A or similar to deselect all.
      e.preventDefault();
      setSelected(new Set(LANGUAGES.map((_, i) => i)));
    } else if (e.key === "Home") {
      e.preventDefault();
      moveFocus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      moveFocus(LANGUAGES.length - 1);
    }
  }

  return (
    <div className="w-72">
      <span id="listbox-pattern-languages-label" className="mb-1.5 block text-sm font-medium">
        Languages (multi-select)
      </span>
      <ul
        id={listboxId}
        role="listbox"
        aria-labelledby="listbox-pattern-languages-label"
        aria-multiselectable="true"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="max-h-64 overflow-auto rounded-lg border border-border bg-card p-1 text-sm"
      >
        {LANGUAGES.map((lang, i) => {
          const isSelected = selected.has(i);
          return (
            <li
              key={lang}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              id={`listbox-pattern-languages-option-${i}`}
              role="option"
              aria-selected={isSelected}
              tabIndex={i === focusIndex ? 0 : -1}
              onClick={(e) => {
                setFocusIndex(i);
                if (e.shiftKey) selectRange(anchorRef.current, i);
                else toggle(i);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md px-3 py-2",
                isSelected ? "bg-accent/15 text-accent-text" : "hover:bg-secondary",
                i === focusIndex && "ring-1 ring-inset ring-accent"
              )}
            >
              {lang}
              {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {selected.size} of {LANGUAGES.length} selected
      </p>
    </div>
  );
}
