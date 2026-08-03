"use client";

import * as React from "react";
import { Check, Clipboard } from "lucide-react";

export interface CodeFile {
  /** Short tab label, e.g. "HTML" or "JS". */
  label: string;
  /** File name shown/announced for the snippet, e.g. "disclosure.html". */
  filename?: string;
  code: string;
}

/**
 * A code snippet with a copy button. Pass a single `code` (+ optional
 * `filename`), or `tabs` for a multi-file solution (e.g. HTML + JS) rendered
 * with an accessible WAI-ARIA tabs pattern — selection follows focus, with
 * arrow-key / Home / End navigation and roving tabindex.
 */
export function CodeBlock({
  code,
  filename,
  tabs,
}: {
  code?: string;
  filename?: string;
  tabs?: CodeFile[];
}) {
  const files: CodeFile[] =
    tabs && tabs.length > 0
      ? tabs
      : [{ label: filename ?? "Code", filename, code: code ?? "" }];

  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const baseId = React.useId();
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const current = files[Math.min(active, files.length - 1)];
  const showTabs = files.length > 1;

  async function handleCopy() {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  // Reset the "Copied" state when switching files so it isn't stale.
  function select(i: number) {
    setActive(i);
    setCopied(false);
  }

  function onTabKeyDown(e: React.KeyboardEvent, i: number) {
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % files.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + files.length) % files.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = files.length - 1;
    else return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="rounded-2xl border border-border bg-secondary/40">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pr-4">
        {showTabs ? (
          <div role="tablist" aria-label="Solution files" className="flex">
            {files.map((f, i) => (
              <button
                key={f.label + i}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={active === i}
                aria-controls={`${baseId}-panel-${i}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={
                  "border-b-2 px-4 py-2 font-mono text-xs transition-colors " +
                  (active === i
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="px-4 py-2 font-mono text-xs text-muted-foreground">
            {current.filename ?? "code"}
          </span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="h-3.5 w-3.5" aria-hidden="true" />
              Copy
            </>
          )}
          <span className="sr-only">
            code for {current.filename ?? current.label}
          </span>
        </button>
      </div>
      {/* tabIndex + role/label make the scrollable code region keyboard-
          reachable so keyboard-only users can scroll long/wide snippets
          (SC 2.1.1) — required whenever a region can overflow. When rendered
          as a tabbed solution the same element doubles as the tabpanel. */}
      <pre
        tabIndex={0}
        role={showTabs ? "tabpanel" : "region"}
        id={showTabs ? `${baseId}-panel-${active}` : undefined}
        aria-labelledby={showTabs ? `${baseId}-tab-${active}` : undefined}
        aria-label={
          showTabs
            ? undefined
            : `Code${current.filename ? `: ${current.filename}` : ""}`
        }
        className="max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed"
      >
        <code className="font-mono">{current.code}</code>
      </pre>
    </div>
  );
}
