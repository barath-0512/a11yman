"use client";

import { useMode } from "@/components/mode-provider";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/reference/code-block";
import { AriaTable } from "@/components/reference/aria-table";
import { KeyboardTable } from "@/components/reference/keyboard-table";
import { ScTable } from "@/components/reference/sc-table";
import { SrAnnouncementTable } from "@/components/reference/sr-announcement-table";
import { DefectPatterns } from "@/components/reference/defect-patterns";
import { TestChecklist } from "@/components/reference/test-checklist";
import { TestProcedure } from "@/components/reference/test-procedure";
import { BrokenFixedToggle } from "@/components/reference/broken-fixed-toggle";
import { ReferencesList } from "@/components/reference/references-list";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { FormsPattern } from "@/components/patterns/forms-pattern";
import { FormsPatternBroken } from "@/components/patterns/forms-pattern-broken";
import { getComponent } from "@/lib/components-data";

const meta = getComponent("forms")!;

const HTML_CODE = `<form id="signup" novalidate>
  <!-- Error summary: hidden until submit fails, then focused so screen
       reader users hear it immediately. role="alert" announces it; each
       item links to the field it describes. -->
  <div id="error-summary" tabindex="-1" role="alert" hidden>
    <p>There are problems with your submission:</p>
    <ul></ul>
  </div>

  <label for="name">Full name</label>
  <input id="name" name="name" aria-describedby="name-error" />
  <p id="name-error" class="error" hidden>Enter your full name.</p>

  <label for="email">Email</label>
  <input id="email" name="email" type="email" aria-describedby="email-error" />
  <p id="email-error" class="error" hidden>Enter a valid email address.</p>

  <button type="submit">Create account</button>
</form>`;

const JS_CODE = `const form = document.getElementById("signup");
const summary = document.getElementById("error-summary");
const summaryList = summary.querySelector("ul");
const fields = ["name", "email"].map((id) => form.elements[id]);

// Each rule returns true when valid, or the error message when not.
function ruleFor(field) {
  if (field.name === "name") return field.value.trim() !== "" || "Enter your full name.";
  return field.value.includes("@") || "Enter a valid email address.";
}

form.addEventListener("submit", (e) => {
  const errors = [];

  fields.forEach((field) => {
    const result = ruleFor(field);
    const invalid = result !== true;
    // aria-invalid marks the field; the -error text is tied to it via
    // aria-describedby, so unhiding it makes the SR read the message.
    field.setAttribute("aria-invalid", String(invalid));
    document.getElementById(field.id + "-error").hidden = !invalid;
    if (invalid) errors.push({ field, msg: result });
  });

  if (errors.length === 0) {
    summary.hidden = true;
    return; // valid — let the form submit
  }

  e.preventDefault();
  summaryList.replaceChildren(
    ...errors.map(({ field, msg }) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + field.id; // clicking moves focus to the field
      a.textContent = msg;
      li.append(a);
      return li;
    })
  );
  summary.hidden = false;
  summary.focus(); // move focus so the alert is announced immediately
});`;

const ARIA_ROWS = [
  { target: "Every input", attribute: "<label htmlFor> associated by id", why: "The only reliable way to give an input a persistent accessible name — placeholder text disappears on input and isn't treated as a label by many screen readers." },
  { target: "Required inputs", attribute: 'required + aria-required="true"', why: "Communicates required state to both native HTML validation and assistive tech; paired with visible, non-color-only text explaining what the asterisk means." },
  { target: "Invalid inputs", attribute: 'aria-invalid="true"', why: 'Marks the field as currently in an error state, announced as "invalid" when the field receives focus.' },
  { target: "Invalid inputs", attribute: "aria-describedby → error message id", why: "Links the field to its specific error text so the message is announced right after the field's name and invalid state." },
  { target: "Error summary container", attribute: 'role="alert" + tabIndex={-1}', why: "role=\"alert\" announces the summary as soon as it appears; tabIndex={-1} makes it programmatically focusable via ref (without adding it to the normal tab order) so focus can be moved there on failed submit." },
  { target: "Common fields", attribute: 'autocomplete="name" | "email" | "tel"', why: "Identifies input purpose (SC 1.3.5) so browsers/password managers autofill correctly and AT can convey the expected kind of data." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves between labeled fields and the submit button in reading order." },
  { keys: "Enter (in a text field)", behavior: "Submits the form, triggering validation." },
  { keys: "Any key (after failed submit, focus in summary)", behavior: "Tab from the error summary moves to the first listed error link/button; activating it (Enter/Space) moves focus directly to the corresponding invalid field." },
];

const SR_ROWS = [
  { step: "Field receives focus (valid state)", jawsChrome: "Email, edit, required", nvdaFirefox: "Email, required, edit", voiceOverSafari: "Email, required, edit text" },
  { step: "Submit pressed with errors present", jawsChrome: "Alert: There are 2 problems with your submission — Enter your full name, link; Enter a valid email address, link", nvdaFirefox: "There are 2 problems with your submission (focus moves to summary automatically)", voiceOverSafari: "There are 2 problems with your submission" },
  { step: "Focus moves to the invalid Email field via summary link", jawsChrome: "Email, edit, invalid entry, required, Error: Enter a valid email address", nvdaFirefox: "Email, required, invalid entry, edit, Error: Enter a valid email address", voiceOverSafari: "Email, required, invalid data, edit text, Error: Enter a valid email address" },
];

const DEFECTS = [
  { defect: "Placeholder text used as the only label", severity: "Critical" as const, description: "No <label> element exists; placeholder text vanishes once the user types and is inconsistently announced as a name by screen readers. Fails SC 3.3.2 and 1.3.1." },
  { defect: "No aria-invalid / aria-describedby on error", severity: "High" as const, description: "An invalid field is never programmatically marked as invalid and its error text (if any) is never linked to it, so a screen reader user tabbing to the field hears nothing about the problem. Fails SC 4.1.2 and 3.3.1." },
  { defect: "Errors shown only as a color change", severity: "Critical" as const, description: "A red border is the ONLY signal of an error — no icon, no text, no error summary. Colorblind users and screen reader users receive no discoverable feedback that submission failed. Fails SC 1.4.1 and 3.3.1." },
  { defect: "No focus management after failed submit", severity: "High" as const, description: "Focus remains on the submit button with no announcement that anything went wrong, so a screen reader user has no indication the form did not submit successfully. Fails SC 3.3.1." },
];

const TEST_STEPS = [
  { action: "Tab through every field without entering any values, then submit.", expected: "An error summary appears, focus moves into it, and it's announced (role=\"alert\" or focused heading) listing every required field that's missing." },
  { action: "Activate an error link/button inside the summary.", expected: "Focus moves directly to the corresponding field; the field's invalid state and error message are announced immediately." },
  { action: "Enter an invalid email (e.g. \"abc\") and submit.", expected: "The email field is marked invalid with a specific, readable error message (not just \"invalid input\")." },
  { action: "Fix all errors and resubmit.", expected: "The form submits successfully; the error summary is removed and a success confirmation is announced." },
  { action: "Check the required-field instruction text.", expected: "A visible, non-color-only explanation of what the asterisk means appears near the top of the form, not only conveyed by color or the asterisk glyph alone." },
];

const CHECKLIST = [
  "Every input has a real <label htmlFor> associated by id — never placeholder-only.",
  "Required fields have both a visible indicator and required/aria-required=\"true\".",
  "The meaning of the required indicator is explained in visible text near the form.",
  "Invalid fields carry aria-invalid=\"true\" and aria-describedby pointing at their error message.",
  "Error text uses a non-color signal (icon and/or \"Error:\" prefix), not color alone.",
  "A failed submit shows an error summary listing every invalid field as a link/button to that field.",
  "Focus moves programmatically to the error summary on failed submit (verified via keyboard, not just visually).",
  "Common fields use correct autocomplete attributes (name, email, tel, etc.).",
  "Successful submission is confirmed in a way assistive tech will announce.",
];

export function FormsPageClient() {
  const { mode } = useMode();

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">Accessible {meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-02" />
      </header>

      {mode !== "tester" && (
      <PageSection id="implementation" title="Implementation">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Field-level aria-invalid/aria-describedby, a focus-managed error
            summary, and non-color error signaling.
          </p>
          {mode === "developer" && (
            <CodeBlock
              tabs={[
                { label: "HTML", filename: "forms.html", code: HTML_CODE },
                { label: "JS", filename: "forms.js", code: JS_CODE },
              ]}
            />
          )}
        </div>
      </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <BrokenFixedToggle
          fixed={
            <div className="rounded-2xl border border-border bg-card p-6">
              <FormsPattern />
            </div>
          }
          broken={
            <div className="rounded-2xl border border-border bg-card p-6">
              <FormsPatternBroken />
            </div>
          }
        />
      </PageSection>

      {mode === "developer" ? (
        <>
          <PageSection id="aria" title="Required roles, states & properties">
            <AriaTable rows={ARIA_ROWS} />
          </PageSection>
          <PageSection id="keyboard" title="Keyboard interaction model">
            <KeyboardTable rows={KEYBOARD_ROWS} />
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>On a failed submit, focus moves programmatically (via ref, not just visually) to the error summary.</li>
              <li>The error summary is focusable (tabIndex={"{-1}"}) but not part of the normal tab order, so it doesn't add an extra unexpected stop on a successful pass through the form.</li>
              <li>Activating an error summary link moves focus directly to the corresponding invalid field, never to an unrelated element.</li>
              <li>Focus is never moved automatically except in direct response to a user action (submit) — receiving focus on a field never itself triggers validation or a context change (SC 3.2.1/3.2.2).</li>
            </ul>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection id="test-procedure" title="Keyboard test procedure">
            <TestProcedure steps={TEST_STEPS} />
          </PageSection>
          <PageSection id="sr-announcements" title="Expected screen reader announcements">
            <SrAnnouncementTable rows={SR_ROWS} />
          </PageSection>
          <PageSection id="defects" title="Common defect patterns">
            <DefectPatterns items={DEFECTS} />
          </PageSection>
          <PageSection id="checklist" title="Test case checklist">
            <TestChecklist componentName={meta.name} items={CHECKLIST} />
          </PageSection>
        </>
      )}

      <PageSection id="wcag" title="WCAG 2.2 success criteria mapping">
        <ScTable scIds={meta.scIds} />
      </PageSection>

      <PageSection id="references" title="References">
        <ReferencesList apgUrl={meta.apgUrl} scIds={meta.scIds} />
      </PageSection>
    </div>
  );
}
