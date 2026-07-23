"use client";

import * as React from "react";
import { Check, Clipboard, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestChecklist({
  componentName,
  items,
}: {
  componentName: string;
  items: string[];
}) {
  const [copied, setCopied] = React.useState(false);
  const text = `${componentName} — test case checklist\n\n${items
    .map((item) => `[ ] ${item}`)
    .join("\n")}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${componentName.toLowerCase().replace(/\s+/g, "-")}-checklist.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Clipboard className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy checklist"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Download .txt
        </Button>
      </div>
      <ul className="space-y-2 rounded-2xl border border-border bg-card p-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              id={`check-${componentName}-${i}`}
              className="mt-1 h-4 w-4 shrink-0 rounded border-border"
            />
            <label htmlFor={`check-${componentName}-${i}`}>{item}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
