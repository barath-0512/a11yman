"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { COMPONENTS } from "@/lib/components-data";
import { ARIA_ATTRIBUTES, ARIA_ROLES } from "@/lib/aria";
import { WCAG_CRITERIA } from "@/lib/wcag";

/**
 * Global site search, dogfooding the APG "combobox with list autocomplete"
 * pattern (see /components/combobox). Unlike the components-only SearchCombobox,
 * this searches across Components, ARIA attributes & roles, and WCAG success
 * criteria, and routes to whichever page the chosen result lives on.
 */

type Kind = "Component" | "ARIA attribute" | "ARIA role" | "WCAG";

interface SearchItem {
  key: string;
  label: string;
  kind: Kind;
  href: string;
  haystack: string;
}

// Built once at module load from the three data sources.
const INDEX: SearchItem[] = [
  ...COMPONENTS.map((c) => ({
    key: `component-${c.slug}`,
    label: c.name,
    kind: "Component" as const,
    href: `/components/${c.slug}`,
    haystack: `${c.name} ${c.category} ${c.definition}`.toLowerCase(),
  })),
  ...ARIA_ATTRIBUTES.map((a) => ({
    key: `attr-${a.name}`,
    label: a.name,
    kind: "ARIA attribute" as const,
    href: `/aria/${a.name}`,
    haystack: `${a.name} ${a.description}`.toLowerCase(),
  })),
  ...ARIA_ROLES.map((r) => ({
    key: `role-${r.name}`,
    label: r.name,
    kind: "ARIA role" as const,
    href: `/aria/${r.name}`,
    haystack: `${r.name} ${r.category} ${r.description}`.toLowerCase(),
  })),
  ...WCAG_CRITERIA.map((w) => ({
    key: `wcag-${w.id}`,
    label: `${w.id} · ${w.name}`,
    kind: "WCAG" as const,
    href: `/wcag#${w.id}`,
    haystack: `${w.id} ${w.name} ${w.summary}`.toLowerCase(),
  })),
];

export function GlobalSearchCombobox({
  instanceId = "global-search",
  autoFocus = false,
}: {
  /** Namespaces element ids so multiple instances can coexist (e.g. the home
   *  page hero and the header search panel). */
  instanceId?: string;
  autoFocus?: boolean;
} = {}) {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = `${instanceId}-listbox`;

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const results = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    const scored: { item: SearchItem; score: number }[] = [];
    for (const item of INDEX) {
      const label = item.label.toLowerCase();
      let score = -1;
      if (label === q) score = 0;
      else if (label.startsWith(q)) score = 1;
      else if (label.includes(q)) score = 2;
      else if (item.haystack.includes(q)) score = 3;
      if (score >= 0) scored.push({ item, score });
    }
    scored.sort((a, b) => a.score - b.score);
    return scored.slice(0, 8).map((s) => s.item);
  }, [value]);

  function commit(index: number) {
    const target = results[index];
    if (!target) return;
    router.push(target.href);
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
      ? `${instanceId}-option-${results[activeIndex].key}`
      : undefined;

  return (
    <div className="relative">
      <label htmlFor={instanceId} className="sr-only">
        Search components, ARIA, and WCAG
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={instanceId}
          type="text"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          placeholder="Search components, ARIA, WCAG… (e.g. dialog, aria-expanded, 2.4.3)"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm shadow-soft"
        />
      </div>
      {open && results.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft-lg"
        >
          {results.map((item, i) => (
            <li
              key={item.key}
              id={`${instanceId}-option-${item.key}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(i);
              }}
              className={
                "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm " +
                (i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-secondary")
              }
            >
              <span
                className={
                  item.kind === "Component" ? "font-medium" : "font-mono font-medium"
                }
              >
                {item.label}
              </span>
              <span className="shrink-0 text-xs opacity-70">{item.kind}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
