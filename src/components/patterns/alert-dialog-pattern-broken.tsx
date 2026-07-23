"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken alert dialog — for learning only.
 *
 * Defects, on purpose:
 * 1. role="dialog" instead of role="alertdialog" — undersells the urgency
 *    of a destructive confirmation; some AT/browser combinations announce
 *    a plain dialog less assertively, so users may not register that this
 *    interruption is different from a routine one (fails 4.1.2 in spirit —
 *    wrong role for the semantics being conveyed).
 * 2. Default focus lands on the destructive "Delete" button instead of
 *    "Cancel" — a very common real-world defect. A user who reflexively
 *    presses Enter (e.g. to dismiss what they assume is a toast, or out of
 *    habit from the previous screen) confirms the destructive action by
 *    accident. This is the exact failure mode the APG's "least destructive
 *    action gets focus" rule exists to prevent.
 * 3. No focus trap and no Escape handling — copied from a rushed Dialog
 *    implementation that never got the alertdialog-specific review.
 */
export function AlertDialogPatternBroken({
  triggerLabel,
  title,
}: {
  triggerLabel: string;
  title: string;
}) {
  const [open, setOpen] = React.useState(false);
  const deleteBtnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (open) {
      // BUG: focus goes to the destructive action, not Cancel.
      deleteBtnRef.current?.focus();
    }
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center justify-center rounded-full bg-destructive px-4 text-sm font-medium text-destructive-foreground"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* BUG: role="dialog" instead of "alertdialog". */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-broken-title"
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft-lg"
          >
            <h2
              id="alert-dialog-broken-title"
              className="mb-2 text-lg font-semibold"
            >
              {title}
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              This action can&apos;t be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-full border border-border px-4 text-sm font-medium hover:bg-secondary"
              >
                Cancel
              </button>
              {/* BUG: this — the destructive action — receives focus on open. */}
              <button
                ref={deleteBtnRef}
                type="button"
                onClick={() => setOpen(false)}
                className="h-9 rounded-full bg-destructive px-4 text-sm font-medium text-destructive-foreground"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
