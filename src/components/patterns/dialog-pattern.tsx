"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogPatternProps {
  triggerLabel: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Hand-coded APG "Dialog (Modal)" pattern.
 *
 * Roles/states: role="dialog", aria-modal="true", aria-labelledby pointing at
 * the visible heading. aria-modal tells assistive tech to treat everything
 * outside the dialog as inert, which is why we ALSO trap focus manually below
 * — aria-modal is a semantic hint, not an enforcement mechanism, and some
 * browsers/AT combinations still let focus (and therefore keyboard users)
 * leak out without an explicit trap.
 */
export function DialogPattern({
  triggerLabel,
  title,
  description,
  children,
}: DialogPatternProps) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  // Remembers what had focus before opening, so we can restore it on close
  // (APG requirement — closing a dialog must not strand focus on <body>).
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const open_ = React.useCallback(() => {
    setOpen(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    // Move focus into the dialog once it mounts. A dialog with no focusable
    // content still needs the dialog surface itself focused so SR users get
    // the "dialog" role announcement immediately.
    closeBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      // Manual focus trap: cycle Tab/Shift+Tab within the dialog's focusable
      // elements so focus can never escape to the page behind it (SC 2.1.2
      // No Keyboard Trap is about NOT trapping outside a modal — inside one,
      // trapping is required so background content stays inert).
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
  }, [open]);

  function close() {
    setOpen(false);
    // Restore focus to the element that opened the dialog (APG requirement).
    triggerRef.current?.focus();
  }

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={open_}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-pattern-title"
            aria-describedby={description ? "dialog-pattern-desc" : undefined}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft-lg"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2
                id="dialog-pattern-title"
                className="text-lg font-semibold"
              >
                {title}
              </h2>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {description && (
              <p
                id="dialog-pattern-desc"
                className="mb-4 text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}
            {children}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="h-9 rounded-full border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={close}
                className="h-9 rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
