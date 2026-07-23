"use client";

import * as React from "react";
import { Check, Clipboard } from "lucide-react";

export function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-secondary/40">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          {filename ?? "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary"
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
          <span className="sr-only">code for {filename ?? "this example"}</span>
        </button>
      </div>
      {/* tabIndex + role/label make the scrollable code region keyboard-
          reachable so keyboard-only users can scroll long/wide snippets
          (SC 2.1.1) — required whenever a region can overflow. */}
      <pre
        tabIndex={0}
        role="region"
        aria-label={`Code${filename ? `: ${filename}` : ""}`}
        className="max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed"
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
