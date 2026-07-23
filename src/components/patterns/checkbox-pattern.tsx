"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckedState = "true" | "false" | "mixed";

const CHILDREN = [
  { id: "email", label: "Email notifications" },
  { id: "sms", label: "SMS notifications" },
  { id: "push", label: "Push notifications" },
];

/**
 * Hand-coded APG "Checkbox (tri-state)" pattern. Built as a "Select all"
 * parent checkbox reflecting the state of three independent child
 * checkboxes — the classic real-world use case for a mixed/indeterminate
 * state.
 *
 * Every checkbox here is role="checkbox" on a <button> rather than a
 * native <input>, because the parent needs a third state (mixed) that a
 * single native checkbox can only express visually, not through a value
 * a form would submit. If you don't need the mixed state, always prefer
 * the native <input type="checkbox"> — see the Native tab.
 */
export function CheckboxPattern() {
  const [checkedIds, setCheckedIds] = React.useState<Set<string>>(
    () => new Set(["email"])
  );

  const allChecked = checkedIds.size === CHILDREN.length;
  const noneChecked = checkedIds.size === 0;
  // The parent's state is derived, never stored independently — this keeps
  // it impossible for the parent and children to disagree.
  const parentState: CheckedState = allChecked
    ? "true"
    : noneChecked
    ? "false"
    : "mixed";

  function toggleChild(id: string) {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleParent() {
    // Clicking "Select all" while in any state other than fully-checked
    // selects everything; clicking it while fully-checked clears everything.
    // (Mixed -> checked -> unchecked is the conventional cycle, not
    // mixed -> unchecked -> checked, matching most desktop OS file pickers.)
    setCheckedIds(allChecked ? new Set() : new Set(CHILDREN.map((c) => c.id)));
  }

  function onKeyDown(e: React.KeyboardEvent, onToggle: () => void) {
    // role="checkbox" carries no built-in activation keys the way a native
    // <input> does, so Space (the APG-specified key for checkboxes) must be
    // wired up by hand. Enter is intentionally NOT bound — checkboxes only
    // respond to Space, unlike buttons.
    if (e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <div className="w-full max-w-sm space-y-3 rounded-2xl border border-border p-4">
      <div className="flex items-center gap-2.5 border-b border-border pb-3">
        <CheckboxBox
          id="select-all"
          state={parentState}
          label="Select all"
          onToggle={toggleParent}
          onKeyDown={(e) => onKeyDown(e, toggleParent)}
        />
      </div>
      <ul className="space-y-2.5 pl-1">
        {CHILDREN.map((child) => {
          const state: CheckedState = checkedIds.has(child.id) ? "true" : "false";
          return (
            <li key={child.id} className="flex items-center gap-2.5">
              <CheckboxBox
                id={child.id}
                state={state}
                label={child.label}
                onToggle={() => toggleChild(child.id)}
                onKeyDown={(e) => onKeyDown(e, () => toggleChild(child.id))}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CheckboxBox({
  id,
  state,
  label,
  onToggle,
  onKeyDown,
}: {
  id: string;
  state: CheckedState;
  label: string;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <button
      type="button"
      id={id}
      // role="checkbox" tells AT to announce "checkbox" and expose the
      // aria-checked value below as its state, instead of the generic
      // "button, pressed/not pressed" semantics a plain <button> would get.
      role="checkbox"
      // aria-checked accepts the literal string "mixed" in addition to a
      // boolean — this is what lets a screen reader announce "partially
      // checked" instead of forcing a binary checked/unchecked lie.
      aria-checked={state === "mixed" ? "mixed" : state === "true"}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      className="flex items-center gap-2.5 rounded-lg"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
          state === "false"
            ? "border-border bg-card"
            : "border-accent bg-accent"
        )}
      >
        {state === "true" && (
          <Check className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={3} />
        )}
        {state === "mixed" && (
          <Minus className="h-3.5 w-3.5 text-accent-foreground" strokeWidth={3} />
        )}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
