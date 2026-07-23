"use client";

import * as React from "react";

interface AlertDialogPatternProps {
  triggerLabel: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

/**
 * Hand-coded APG "Alert Dialog" pattern.
 *
 * role="alertdialog" (not "dialog") tells AT this is an interruption that
 * demands acknowledgment — some screen readers announce it more forcefully
 * than a plain dialog. Everything else about focus containment mirrors the
 * regular Dialog pattern EXCEPT one deliberate difference: focus on open
 * goes to the LEAST destructive action (Cancel), never the confirm/destroy
 * button. This guards against a sighted-but-hasty or repeat-keystroke user
 * (e.g. someone who double-pressed Enter to dismiss the trigger) from
 * blowing through a destructive confirmation by accident. The APG calls
 * this out specifically for alertdialog — it's the main reason this pattern
 * exists as distinct from Dialog rather than just being "Dialog with scarier
 * copy."
 */
export function AlertDialogPattern({
  triggerLabel,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: AlertDialogPatternProps) {
  const [open, setOpen] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  // Focus goes here on open — the least destructive action — not the
  // confirm button. This is the key APG difference from a plain Dialog.
  const cancelBtnRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    cancelBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      // Alert dialogs still support Escape as an explicit, unambiguous
      // "no action taken" exit — it never confirms the destructive action.
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // Manual focus trap, identical rationale to the Dialog pattern: an
      // interruption this important must not let focus (and therefore
      // attention) leak to the page behind it.
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
    triggerRef.current?.focus();
  }

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-full bg-destructive px-4 text-sm font-medium text-destructive-foreground"
      >
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          // Note: unlike the plain Dialog, we do NOT close on scrim click.
          // A true alertdialog interrupts on purpose — an accidental click
          // outside it should not silently dismiss a critical confirmation.
        >
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-pattern-title"
            aria-describedby={description ? "alert-dialog-pattern-desc" : undefined}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft-lg"
          >
            <h2
              id="alert-dialog-pattern-title"
              className="mb-2 text-lg font-semibold"
            >
              {title}
            </h2>
            {description && (
              <p
                id="alert-dialog-pattern-desc"
                className="mb-4 text-sm text-muted-foreground"
              >
                {description}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                ref={cancelBtnRef}
                type="button"
                onClick={close}
                className="h-9 rounded-full border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={close}
                className="h-9 rounded-full bg-destructive px-4 text-sm font-medium text-destructive-foreground"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
