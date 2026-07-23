"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { COMPONENTS } from "@/lib/components-data";

/**
 * APG "combobox with list autocomplete" pattern, dogfooded as the site
 * search. See /components/combobox for the fully documented, standalone
 * version of this same pattern.
 */
export function SearchCombobox() {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = "site-search-listbox";

  const results = React.useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return COMPONENTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [value]);

  function commit(index: number) {
    const target = results[index];
    if (!target) return;
    router.push(`/components/${target.slug}`);
    setValue("");
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        commit(activeIndex);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const activeId =
    activeIndex >= 0 && results[activeIndex]
      ? `search-option-${results[activeIndex].slug}`
      : undefined;

  return (
    <div className="relative">
      <label htmlFor="site-search" className="sr-only">
        Search components by name or category
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="site-search"
          type="text"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          placeholder="Search components (e.g. dialog, tabs, slider)…"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-base shadow-soft"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Component suggestions"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft-lg"
        >
          {results.map((c, i) => (
            <li
              key={c.slug}
              id={`search-option-${c.slug}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(i);
              }}
              className={
                "cursor-pointer px-4 py-2.5 text-sm " +
                (i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-secondary")
              }
            >
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-xs opacity-70">{c.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
