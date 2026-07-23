"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CHILDREN = [
  { id: "email", label: "Email notifications" },
  { id: "sms", label: "SMS notifications" },
  { id: "push", label: "Push notifications" },
];

/**
 * ⚠ Deliberately broken checkbox group — for learning only.
 *
 * Defects, on purpose:
 * 1. Checkboxes are <div>s with an onClick handler — not real <button>s or
 *    <input>s, so they have no default focusability and no keyboard
 *    activation at all. A keyboard-only user cannot check or uncheck
 *    anything. Fails SC 2.1.1 and 4.1.2.
 * 2. No role="checkbox" and no aria-checked — a screen reader announces
 *    these as plain, non-interactive text, so users don't even know a
 *    control is present. Fails SC 4.1.2.
 * 3. The "Select all" parent only ever renders fully-checked or
 *    fully-unchecked — it never shows a mixed/indeterminate state when
 *    some but not all children are checked, silently misrepresenting the
 *    actual selection to every user, sighted or not. Fails SC 4.1.2 and
 *    is a common, very real defect in hand-rolled "select all" UIs.
 * 4. No visible focus indicator is possible because the element is never
 *    focusable in the first place.
 */
export function CheckboxPatternBroken() {
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(
    () => new Set(["email"])
  );

  const allChecked = checkedIds.size === CHILDREN.length;

  function toggleChild(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleParent() {
    setCheckedIds(allChecked ? new Set() : new Set(CHILDREN.map((c) => c.id)));
  }

  return (
    <div className="w-full max-w-sm space-y-3 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <FakeCheckbox checked={allChecked} label="Select all" onClick={toggleParent} />
      </div>
      <ul className="space-y-2.5 pl-1">
        {CHILDREN.map((child) => (
          <li key={child.id} className="flex items-center gap-2.5">
            <FakeCheckbox
              checked={checkedIds.has(child.id)}
              label={child.label}
              onClick={() => toggleChild(child.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FakeCheckbox({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-2.5">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
          checked ? "border-accent bg-accent" : "border-border bg-card"
        )}
      >
        {checked && <Check className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={3} />}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
