"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(d: Date) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatLong(d: Date) {
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Hand-coded APG "Date Picker Dialog" pattern: a text input + button that
 * opens a dialog containing a calendar grid.
 *
 * The popup dialog reuses the SAME focus-trap / Escape-to-close /
 * focus-restore-to-trigger logic as the flagship Dialog pattern
 * (see dialog-pattern.tsx) — a date picker popup is functionally a
 * specialized dialog, so none of that logic is reinvented here.
 *
 * Roles/attributes and why they exist:
 * - role="dialog" + aria-modal="true" + aria-labelledby: same reasoning as
 *   the Dialog pattern — identifies the popup, its modal-ness, and its name.
 * - role="grid" on the calendar table and role="row" on each week: exposes
 *   the calendar as a 2D grid so AT grid navigation commands work and the
 *   day-of-week / date relationship is programmatically clear.
 * - role="gridcell" on each date cell, with aria-selected on the chosen
 *   date: standard ARIA grid cell semantics.
 * - Roving tabindex: only the currently-focused date cell has tabIndex=0;
 *   every other cell has tabIndex=-1. This keeps a single Tab stop for the
 *   whole grid (matching the roving-tabindex approach used by Menu/Tabs on
 *   this site) while arrow keys move a virtual/actual focus point within it.
 * - aria-label additions for today/selected: e.g. "Today, June 15" or
 *   "Selected, June 20" so that meaning isn't conveyed by visual styling
 *   (a ring / dot) alone.
 */
export function DatePickerPattern() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Date | null>(null);
  const [focusedDate, setFocusedDate] = React.useState<Date>(() => new Date());
  const [inputValue, setInputValue] = React.useState("");

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const cellRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  const today = React.useMemo(() => new Date(), []);

  function openPicker() {
    setFocusedDate(selected ?? new Date());
    setOpen(true);
  }

  function closePicker(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function selectDate(d: Date) {
    setSelected(d);
    setInputValue(formatDate(d));
    closePicker(true);
  }

  // Focus trap + Escape handling, adapted directly from dialog-pattern.tsx.
  React.useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePicker(true);
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Move actual DOM focus to whichever cell is the current roving-tabindex
  // target whenever it changes (grid navigation, or on open).
  React.useEffect(() => {
    if (!open) return;
    const key = formatDate(focusedDate);
    cellRefs.current.get(key)?.focus();
  }, [open, focusedDate]);

  function moveFocus(days: number) {
    setFocusedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + days);
      return next;
    });
  }

  function moveMonths(months: number) {
    setFocusedDate((prev) => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + months);
      return next;
    });
  }

  function moveYears(years: number) {
    setFocusedDate((prev) => {
      const next = new Date(prev);
      next.setFullYear(next.getFullYear() + years);
      return next;
    });
  }

  function onGridKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        moveFocus(7);
        break;
      case "ArrowUp":
        e.preventDefault();
        moveFocus(-7);
        break;
      case "Home":
        e.preventDefault();
        setFocusedDate((prev) => startOfWeek(prev));
        break;
      case "End":
        e.preventDefault();
        setFocusedDate((prev) => {
          const start = startOfWeek(prev);
          const end = new Date(start);
          end.setDate(end.getDate() + 6);
          return end;
        });
        break;
      case "PageUp":
        e.preventDefault();
        if (e.shiftKey) moveYears(-1);
        else moveMonths(-1);
        break;
      case "PageDown":
        e.preventDefault();
        if (e.shiftKey) moveYears(1);
        else moveMonths(1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectDate(focusedDate);
        break;
      default:
        break;
    }
  }

  // Build the visible grid: full weeks covering the focused month.
  const monthStart = new Date(focusedDate.getFullYear(), focusedDate.getMonth(), 1);
  const gridStart = startOfWeek(monthStart);
  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <label htmlFor="date-picker-input" className="sr-only">
          Date
        </label>
        <input
          id="date-picker-input"
          type="text"
          placeholder="YYYY-MM-DD"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-10 w-40 rounded-lg border border-border bg-background px-3 text-sm"
        />
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={openPicker}
          aria-label="Choose date"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
        >
          <CalendarIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 pt-24"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closePicker(true);
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Choose date, ${MONTH_NAMES[focusedDate.getMonth()]} ${focusedDate.getFullYear()}`}
            className="w-full max-w-xs rounded-2xl border border-border bg-card p-4 shadow-soft-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => moveMonths(-1)}
                aria-label="Previous month"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-sm font-semibold" aria-live="polite">
                {MONTH_NAMES[focusedDate.getMonth()]} {focusedDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => moveMonths(1)}
                aria-label="Next month"
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div role="grid" aria-labelledby={undefined} onKeyDown={onGridKeyDown} className="w-full">
              <div role="row" className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                {WEEKDAY_LABELS.map((wd) => (
                  <span key={wd} role="columnheader" aria-label={wd} className="py-1">
                    {wd[0]}
                  </span>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} role="row" className="grid grid-cols-7">
                  {week.map((day) => {
                    const inMonth = day.getMonth() === focusedDate.getMonth();
                    const isToday = isSameDay(day, today);
                    const isSelected = selected ? isSameDay(day, selected) : false;
                    const isFocusTarget = isSameDay(day, focusedDate);
                    const key = formatDate(day);

                    let label = String(day.getDate());
                    if (isToday) label = `Today, ${formatLong(day)}`;
                    else if (isSelected) label = `Selected, ${formatLong(day)}`;

                    return (
                      <button
                        key={key}
                        ref={(el) => {
                          if (el) cellRefs.current.set(key, el);
                          else cellRefs.current.delete(key);
                        }}
                        type="button"
                        role="gridcell"
                        aria-selected={isSelected}
                        aria-label={label}
                        tabIndex={isFocusTarget ? 0 : -1}
                        onClick={() => selectDate(day)}
                        onFocus={() => setFocusedDate(day)}
                        className={
                          "m-0.5 flex h-9 w-9 items-center justify-center rounded-full text-sm " +
                          (!inMonth ? "text-muted-foreground " : "") +
                          (isSelected ? "bg-accent text-accent-foreground " : "") +
                          (isToday && !isSelected ? "border border-accent text-accent-text " : "") +
                          (!isSelected && !isToday ? "hover:bg-secondary " : "")
                        }
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
