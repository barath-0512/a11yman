"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
}

/**
 * Hand-coded form pattern: labels, required-field indication, inline
 * errors, and a focus-managed error summary.
 *
 * Why each piece exists:
 * - <label htmlFor>: the ONLY reliable way to give an input an accessible
 *   name that persists (placeholder text disappears once typing starts,
 *   and isn't treated as a label by most screen readers).
 * - Visible "(required)" text plus the required/aria-required attribute:
 *   an asterisk alone conveys meaning only visually — SC 3.3.2 requires
 *   the instruction to be available in text, so we spell out what * means
 *   once, visibly, near the top of the form.
 * - aria-invalid="true" + aria-describedby pointing at the error message
 *   id: links a field to its specific error text so a screen reader
 *   announces both "invalid" and the error message when the field
 *   receives focus, not just a generic bad-state beep.
 * - Error text uses an icon + "Error:" prefix, not color alone (SC 1.4.1
 *   Use of Color).
 * - Error summary at the top, shown after a failed submit: lists every
 *   error as a link/button jumping to its field. Focus is moved into the
 *   summary via a ref (tabIndex={-1} makes it programmatically focusable
 *   without adding it to the normal tab order), so screen reader users
 *   immediately hear what's wrong instead of having to discover it by
 *   tabbing through the whole form.
 * - autocomplete attributes (SC 1.3.5 Identify Input Purpose): let browsers
 *   and password managers correctly fill common fields, and let AT convey
 *   the expected input purpose.
 */
export function FormsPattern() {
  const [values, setValues] = React.useState<FormValues>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitted, setSubmitted] = React.useState(false);

  const summaryRef = React.useRef<HTMLDivElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const fieldRefs: Record<keyof FieldErrors, React.RefObject<HTMLInputElement>> = {
    name: nameRef,
    email: emailRef,
  };

  function validate(v: FormValues): FieldErrors {
    const next: FieldErrors = {};
    if (!v.name.trim()) next.name = "Enter your full name.";
    if (!v.email.trim()) {
      next.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      next.email = "Enter a valid email address, like name@example.com.";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitted(true);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the error summary so screen reader users hear the
      // failure and the list of problems immediately, instead of silently
      // staying on the submit button.
      requestAnimationFrame(() => summaryRef.current?.focus());
    }
  }

  function focusField(key: keyof FieldErrors) {
    fieldRefs[key].current?.focus();
  }

  const errorEntries = Object.entries(errors) as [keyof FieldErrors, string][];
  const hasErrors = submitted && errorEntries.length > 0;

  if (submitted && errorEntries.length === 0) {
    return (
      <div role="status" className="rounded-2xl border border-success/40 bg-success/10 p-6 text-sm text-success-text">
        Thanks, {values.name || "friend"} — your details were submitted successfully.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">
        Fields marked <span aria-hidden="true" className="text-destructive">*</span>
        <span className="sr-only">(required)</span> are required.
      </p>

      {hasErrors && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="space-y-2 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive-text"
        >
          <p className="flex items-center gap-2 font-semibold">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            There {errorEntries.length === 1 ? "is 1 problem" : `are ${errorEntries.length} problems`} with your submission
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {errorEntries.map(([key, message]) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => focusField(key)}
                  className="underline decoration-dotted underline-offset-2"
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="fp-name" className="text-sm font-medium">
          Full name <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <input
          ref={nameRef}
          id="fp-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-required="true"
          aria-invalid={submitted && !!errors.name}
          aria-describedby={submitted && errors.name ? "fp-name-error" : undefined}
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        {submitted && errors.name && (
          <p id="fp-name-error" className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-medium">Error:</span> {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="fp-email" className="text-sm font-medium">
          Email <span aria-hidden="true" className="text-destructive">*</span>
        </label>
        <input
          ref={emailRef}
          id="fp-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-required="true"
          aria-invalid={submitted && !!errors.email}
          aria-describedby={submitted && errors.email ? "fp-email-error" : undefined}
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        {submitted && errors.email && (
          <p id="fp-email-error" className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-medium">Error:</span> {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="fp-phone" className="text-sm font-medium">
          Phone <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="fp-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
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
