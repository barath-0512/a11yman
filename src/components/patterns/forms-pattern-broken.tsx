"use client";

import * as React from "react";

/**
 * ⚠ Deliberately broken form — for learning only.
 *
 * Defects, on purpose:
 * 1. Placeholder text used AS the only label — there is no <label>
 *    element at all. The placeholder disappears the moment the user
 *    starts typing, and many screen readers either don't announce
 *    placeholder text as a name or announce it inconsistently with a
 *    real label. Fails SC 3.3.2 and 1.3.1.
 * 2. No aria-invalid / aria-describedby anywhere — a field in an error
 *    state is not programmatically identified as invalid, and its error
 *    text (if shown at all) is never linked to the field. Fails SC 4.1.2.
 * 3. Errors are communicated ONLY via a color change (red border) with no
 *    text, no icon, and no error summary. A colorblind user gets no
 *    signal, and a screen reader user gets literally nothing — the
 *    invalid submission produces no discoverable feedback at all.
 *    Fails SC 1.4.1 and 3.3.1.
 * 4. No focus management on failed submit — focus simply stays on the
 *    submit button with no indication anything went wrong.
 */
export function FormsPatternBroken() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [invalid, setInvalid] = React.useState<{ name: boolean; email: boolean }>({
    name: false,
    email: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInvalid({ name: !name.trim(), email: !email.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-1.5">
        {/* No <label>. Placeholder is the only "label", and disappears on input. */}
        <input
          type="text"
          placeholder="Full name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={
            "h-10 w-full rounded-lg border bg-background px-3 text-sm " +
            (invalid.name ? "border-red-500" : "border-border")
          }
        />
      </div>

      <div className="space-y-1.5">
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={
            "h-10 w-full rounded-lg border bg-background px-3 text-sm " +
            (invalid.email ? "border-red-500" : "border-border")
          }
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground"
      >
        Submit
      </button>
    </form>
  );
}
