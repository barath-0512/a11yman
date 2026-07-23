"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

const FRUITS = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cantaloupe",
  "Cherry",
  "Clementine",
  "Coconut",
];

/**
 * Hand-coded APG "Combobox with list autocomplete" pattern.
 *
 * The input keeps DOM focus at all times — arrowing through the popup moves
 * a *visual* highlight and updates aria-activedescendant, it never moves
 * real focus onto an <li>. This is what lets a screen reader keep reading
 * the edit field while announcing which option is active.
 */
export function ComboboxPattern() {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = "combobox-fruit-listbox";

  const options = React.useMemo(() => {
    if (!value) return FRUITS;
    return FRUITS.filter((f) => f.toLowerCase().includes(value.toLowerCase()));
  }, [value]);

  function selectOption(option: string) {
    setValue(option);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(0);
        return;
      }
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0) {
        e.preventDefault();
        selectOption(options[activeIndex]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    }
  }

  const activeId =
    activeIndex >= 0 && options[activeIndex]
      ? `combobox-fruit-option-${activeIndex}`
      : undefined;

  return (
    <div className="w-72">
      <label htmlFor="combobox-fruit-input" className="mb-1.5 block text-sm font-medium">
        Fruit
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="combobox-fruit-input"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="h-10 w-full rounded-lg border border-border bg-card px-3 pr-9 text-sm"
        />
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
      {open && options.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Fruits"
          className="relative z-10 mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-card shadow-soft-lg"
        >
          {options.map((option, i) => (
            <li
              key={option}
              id={`combobox-fruit-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                selectOption(option);
              }}
              className={
                "cursor-pointer px-3 py-2 text-sm " +
                (i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-secondary")
              }
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
