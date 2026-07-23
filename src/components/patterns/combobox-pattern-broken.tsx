"use client";

import * as React from "react";

const FRUITS = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry"];

/**
 * ⚠ Deliberately broken combobox — for learning only.
 *
 * Defects, on purpose:
 * 1. No role="combobox" / aria-expanded / aria-controls — the input is
 *    announced as a plain edit field with no indication a popup exists.
 * 2. Options are only reachable by mouse hover; there is no keyboard path
 *    to them at all (fails 2.1.1).
 * 3. No aria-activedescendant, so even if a sighted keyboard user visually
 *    highlights an option some other way, a screen reader has no idea an
 *    option is "active."
 */
export function ComboboxPatternBroken() {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const options = FRUITS.filter((f) =>
    f.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="w-72">
      <label htmlFor="broken-combobox-input" className="mb-1.5 block text-sm font-medium">
        Fruit
      </label>
      <input
        id="broken-combobox-input"
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
      />
      {open && (
        <ul className="mt-1 max-h-56 overflow-auto rounded-lg border border-border bg-card shadow-soft-lg">
          {options.map((option) => (
            // No role="option", no keyboard access — mouse only.
            <li
              key={option}
              onMouseDown={(e) => {
                e.preventDefault();
                setValue(option);
                setOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-secondary"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
