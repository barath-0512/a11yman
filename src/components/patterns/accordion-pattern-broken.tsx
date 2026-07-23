"use client";

import * as React from "react";

const SECTIONS = [
  { id: "shipping", title: "Shipping", body: "Orders ship within 2 business days via standard carrier." },
  { id: "returns", title: "Returns", body: "Items can be returned within 30 days of delivery for a full refund." },
];

/**
 * ⚠ Deliberately broken accordion — for learning only.
 *
 * Defects, on purpose:
 * 1. Headers are <div>s with a click handler, not <button>s — not focusable
 *    or keyboard-operable at all (fails 2.1.1 and 4.1.2).
 * 2. No aria-expanded — even a sighted keyboard user relying on
 *    high-contrast/zoom has no programmatic way to know panel state.
 * 3. No aria-controls linking header to panel.
 */
export function AccordionPatternBroken() {
  const [openId, setOpenId] = React.useState<string | null>("shipping");

  return (
    <div className="w-full max-w-xl divide-y divide-border rounded-2xl border border-border">
      {SECTIONS.map((section) => (
        <div key={section.id}>
          <div
            onClick={() =>
              setOpenId(openId === section.id ? null : section.id)
            }
            className="cursor-pointer px-4 py-3.5 text-sm font-medium"
          >
            {section.title}
          </div>
          {openId === section.id && (
            <div className="px-4 pb-4 text-sm text-muted-foreground">
              {section.body}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
