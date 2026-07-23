"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

const SECTIONS = [
  { id: "shipping", title: "Shipping", body: "Orders ship within 2 business days via standard carrier." },
  { id: "returns", title: "Returns", body: "Items can be returned within 30 days of delivery for a full refund." },
  { id: "warranty", title: "Warranty", body: "All products include a 1-year limited manufacturer warranty." },
];

/**
 * Hand-coded APG "Accordion" pattern. Each header is a <button> wrapped in
 * a heading element (so the accordion still shows up in a heading
 * navigation list), toggling aria-expanded and the visibility of its
 * associated panel. Multiple panels may be open at once (non-exclusive).
 */
export function AccordionPattern() {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(["shipping"])
  );
  const headerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let nextIndex: number | null = null;
    if (e.key === "ArrowDown") nextIndex = (index + 1) % SECTIONS.length;
    if (e.key === "ArrowUp") nextIndex = (index - 1 + SECTIONS.length) % SECTIONS.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = SECTIONS.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      headerRefs.current[SECTIONS[nextIndex].id]?.focus();
    }
  }

  return (
    <div className="w-full max-w-xl divide-y divide-border rounded-2xl border border-border">
      {SECTIONS.map((section, i) => {
        const expanded = openIds.has(section.id);
        return (
          <div key={section.id}>
            <h3 className="m-0">
              <button
                ref={(el) => {
                  headerRefs.current[section.id] = el;
                }}
                type="button"
                aria-expanded={expanded}
                aria-controls={`panel-${section.id}`}
                id={`header-${section.id}`}
                onClick={() => toggle(section.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium"
              >
                {section.title}
                <ChevronDown
                  aria-hidden="true"
                  className={
                    "h-4 w-4 shrink-0 transition-transform " +
                    (expanded ? "rotate-180" : "")
                  }
                />
              </button>
            </h3>
            <div
              id={`panel-${section.id}`}
              role="region"
              aria-labelledby={`header-${section.id}`}
              hidden={!expanded}
              className="px-4 pb-4 text-sm text-muted-foreground"
            >
              {section.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
