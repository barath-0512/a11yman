"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Code2, ClipboardCheck, ArrowLeftRight } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { useMode, type SiteMode } from "@/components/mode-provider";
import { useToast } from "@/components/toast-provider";

const CHOICES: {
  value: SiteMode;
  label: string;
  icon: typeof Code2;
  blurb: string;
}[] = [
  {
    value: "developer",
    label: "I'm a developer",
    icon: Code2,
    blurb:
      "Show live code, required ARIA, keyboard models, and focus-management rules for each pattern.",
  },
  {
    value: "tester",
    label: "I'm a tester",
    icon: ClipboardCheck,
    blurb:
      "Show step-by-step test procedures, screen reader announcements, WCAG mapping, and defect templates.",
  },
];

/**
 * First-visit welcome overlay. It blurs the whole page and presents only the
 * Developer / Tester mode choice as a modal dialog. This dogfoods the site's
 * own Dialog pattern: role="dialog" + aria-modal, focus moved in on open,
 * a Tab focus-trap, and Escape to dismiss (so it's never a keyboard trap).
 */
export function Onboarding() {
  const { mounted, showOnboarding, setMode, dismissOnboarding } = useMode();
  const { show } = useToast();
  const pathname = usePathname();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const firstBtnRef = React.useRef<HTMLButtonElement>(null);

  // The mode only affects component pages, so only prompt for it once the user
  // enters the /components section — not on the home page or elsewhere.
  const active = mounted && showOnboarding && pathname.startsWith("/components");

  // Move focus into the dialog on open, trap Tab within it, and handle Escape.
  React.useEffect(() => {
    if (!active) return;
    firstBtnRef.current?.focus();

    // Prevent the blurred page behind the dialog from scrolling.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Make the entire page behind the dialog inert: it drops out of the tab
    // order AND the accessibility tree, so keyboard/AT users are natively
    // contained in the dialog (SC 2.1.1 / 2.4.3). The Tab handler below then
    // only needs to keep focus cycling tidily within the dialog itself.
    const appShell = document.getElementById("app-shell");
    appShell?.setAttribute("inert", "");

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        finish();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      appShell?.removeAttribute("inert");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function finish() {
    dismissOnboarding();
    // Point the user at the persistent control, and hand focus to it so a
    // keyboard user lands somewhere sensible after the dialog closes.
    const toggle = document.querySelector<HTMLElement>(
      '[role="radiogroup"][aria-label="Site mode"] [role="radio"][aria-checked="true"]'
    );
    toggle?.focus();
    show(
      "You can switch between Developer and Tester mode anytime",
      {
        durationMs: 9000,
        icon: <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />,
      }
    );
  }

  function choose(value: SiteMode) {
    setMode(value);
    finish();
  }

  if (!active) return null;

  return (
    <div
      data-nosnippet
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Blur + dim everything behind the dialog. */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md"
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-desc"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-soft-lg sm:p-8"
      >
        <div className="mb-5 flex items-center gap-2 text-xl">
          <AppLogo className="h-[1.15em] w-auto shrink-0" />
          <h2
            id="onboarding-title"
            className="text-xl font-semibold tracking-tight"
          >
            Welcome to a11yman — how will you use it?
          </h2>
        </div>

        <p id="onboarding-desc" className="mb-6 text-sm text-muted-foreground">
          Every component page adapts to your role. Are you a developer or a
          tester? Pick one to get started — you can change it at any time.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {CHOICES.map((choice, i) => (
            <button
              key={choice.value}
              ref={i === 0 ? firstBtnRef : undefined}
              type="button"
              onClick={() => choose(choice.value)}
              className="group flex h-full flex-col items-start gap-2 rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-accent hover:bg-secondary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-accent group-hover:bg-accent group-hover:text-accent-foreground">
                <choice.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-medium">{choice.label}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {choice.blurb}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={finish}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
