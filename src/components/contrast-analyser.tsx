"use client";

import * as React from "react";
import {
  Pipette,
  ArrowUpDown,
  Copy,
  Check,
  CircleCheck,
  X,
  Download,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  parseHex,
  toHex,
  evaluate,
  suggestPassing,
  type RGB,
} from "@/lib/contrast";
import { cn } from "@/lib/utils";

/** A small AA/AAA pass-fail pill used in the results breakdown. */
function LevelBadge({ level, pass }: { level: "AA" | "AAA"; pass: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        pass
          ? "bg-success/15 text-success-text"
          : "bg-destructive/15 text-destructive-text"
      )}
    >
      {level}
      <span className="sr-only">{pass ? "passes" : "fails"}</span>
      {pass ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      )}
    </span>
  );
}

const DEFAULT_FG = "#1A1A1A";
const DEFAULT_BG = "#FFFFFF";

interface SuggestionRow {
  sc: string;
  name: string;
  level: "AA" | "AAA";
  lines: { label: string; ratio: string }[];
  target: number;
}

const SUGGESTIONS: Record<"AA" | "AAA", SuggestionRow[]> = {
  AA: [
    { sc: "1.4.3", name: "Contrast (Minimum)", level: "AA", target: 4.5, lines: [ { label: "Normal text", ratio: "4.5:1" }, { label: "Large text", ratio: "3:1" } ] },
    { sc: "1.4.11", name: "Non-text Contrast", level: "AA", target: 3, lines: [ { label: "UI & graphical objects", ratio: "3:1" } ] },
  ],
  AAA: [
    { sc: "1.4.6", name: "Contrast (Enhanced)", level: "AAA", target: 7, lines: [ { label: "Normal text", ratio: "7:1" }, { label: "Large text", ratio: "4.5:1" } ] },
  ],
};

/** A hex colour field: text input + a native colour-picker swatch + eyedropper. */
function ColourField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const rgb = parseHex(value);
  const swatch = rgb ? toHex(rgb) : "#000000";
  const invalid = !rgb;

  async function pick() {
    const w = window as unknown as { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } };
    if (!w.EyeDropper) return;
    try {
      const res = await new w.EyeDropper().open();
      onChange(res.sRGBHex.toUpperCase());
    } catch {
      /* user cancelled */
    }
  }

  // Detect EyeDropper support after mount: these pages are statically
  // rendered, so a render-time `window` check bakes "unsupported" into the HTML
  // and never re-evaluates on the client. Starting false keeps SSR and the
  // first client render in sync, then the effect flips it on where it exists.
  const [supportsEyedropper, setSupportsEyedropper] = React.useState(false);
  React.useEffect(() => {
    setSupportsEyedropper("EyeDropper" in window);
  }, []);

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div
          className={
            "flex flex-1 items-center gap-3 rounded-xl border bg-card px-3 py-2.5 " +
            (invalid ? "border-destructive" : "border-border")
          }
        >
          <label
            className="relative h-7 w-7 shrink-0 cursor-pointer rounded-md border border-border has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
            style={{ backgroundColor: swatch }}
          >
            <span className="sr-only">Pick {label.toLowerCase()}</span>
            <input
              type="color"
              value={swatch}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
          <input
            id={id}
            type="text"
            inputMode="text"
            spellCheck={false}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${id}-err` : undefined}
            className="w-full bg-transparent font-mono text-sm uppercase outline-none"
          />
        </div>
        <button
          type="button"
          onClick={pick}
          disabled={!supportsEyedropper}
          aria-label={`Pick ${label.toLowerCase()} from screen`}
          title={supportsEyedropper ? "Eyedropper" : "Eyedropper not supported in this browser"}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 lg:inline-flex"
        >
          <Pipette className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {invalid && (
        <p id={`${id}-err`} className="text-xs text-destructive-text">
          Enter a valid hex colour, e.g. #1A1A1A.
        </p>
      )}
    </div>
  );
}

export function ContrastAnalyser({ initialQuote }: { initialQuote: string }) {
  const [fg, setFg] = React.useState(DEFAULT_FG);
  const [bg, setBg] = React.useState(DEFAULT_BG);
  const [level, setLevel] = React.useState<"AA" | "AAA">("AA");
  const [copied, setCopied] = React.useState<string | null>(null);
  const [announce, setAnnounce] = React.useState("");

  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const valid = fgRgb && bgRgb;
  const result = valid ? evaluate(fgRgb as RGB, bgRgb as RGB) : null;

  // Once the pair clears every AA requirement, the AA suggestions are moot
  // ("no changes needed"), so auto-surface the AAA suggestions. Keyed on the
  // pass-state, so it only switches on that transition — manual toggling still
  // works in between.
  const passesAllAA =
    !!result && SUGGESTIONS.AA.every((r) => result.ratio >= r.target);
  React.useEffect(() => {
    setLevel(passesAllAA ? "AAA" : "AA");
  }, [passesAllAA]);

  function swap() {
    setFg(bg);
    setBg(fg);
  }

  function reset() {
    setFg(DEFAULT_FG);
    setBg(DEFAULT_BG);
    setAnnounce("Reset to defaults.");
  }

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setAnnounce(`Copied ${hex}.`);
      window.setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  function exportResult() {
    if (!result) return;
    const text = [
      "a11yman — Color Contrast Checker",
      "",
      `Foreground: ${toHex(fgRgb as RGB)}`,
      `Background: ${toHex(bgRgb as RGB)}`,
      `Contrast ratio: ${result.ratio.toFixed(2)}:1`,
      "",
      `WCAG 1.4.3 Normal text (4.5:1): ${result.passesAANormal ? "PASS" : "FAIL"}`,
      `WCAG 1.4.3 Large text (3:1): ${result.passesAALarge ? "PASS" : "FAIL"}`,
      `WCAG 1.4.6 Normal text (7:1): ${result.passesAAANormal ? "PASS" : "FAIL"}`,
      `WCAG 1.4.6 Large text (4.5:1): ${result.passesAAALarge ? "PASS" : "FAIL"}`,
      "",
      "Calculations based on WCAG 2.2.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "a11yman-contrast-result.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const badgeTone =
    result?.level === "AAA" || result?.level === "AA"
      ? "bg-success/15 text-success-text"
      : result?.level === "AA Large"
        ? "bg-warning/15 text-warning-text"
        : "bg-destructive/15 text-destructive-text";

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-secondary/30 shadow-soft">
      <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,22rem)_1fr]">
        {/* ── Left: inputs + preview ── */}
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <ColourField id="fg" label="Foreground colour" value={fg} onChange={setFg} />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={swap}
              aria-label="Swap foreground and background colours"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <ColourField id="bg" label="Background colour" value={bg} onChange={setBg} />

          {/* Preview */}
          <div
            className="space-y-1.5 rounded-2xl border border-border p-4"
            style={
              valid
                ? { backgroundColor: toHex(bgRgb as RGB), color: toHex(fgRgb as RGB) }
                : undefined
            }
          >
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">
              Preview
            </p>
            <p className="text-lg font-semibold leading-snug">{initialQuote}</p>
            <p className="text-sm opacity-80">This is how your text will look.</p>
          </div>
        </div>

        {/* ── Right: result + suggestions ── */}
        <div className="space-y-4">
          {/* Contrast ratio */}
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Contrast ratio
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <span className="text-5xl font-semibold tracking-tight">
                {result ? `${result.ratio.toFixed(2)} : 1` : "—"}
              </span>
              {result && (
                <span className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${badgeTone}`}>
                  {result.level}
                </span>
              )}
            </div>
            {result && (
              <dl className="mt-4 space-y-2.5 border-t border-border pt-4 text-left">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm">Normal text</dt>
                  <dd className="flex items-center gap-2">
                    <LevelBadge level="AA" pass={result.passesAANormal} />
                    <LevelBadge level="AAA" pass={result.passesAAANormal} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm">Large text</dt>
                  <dd className="flex items-center gap-2">
                    <LevelBadge level="AA" pass={result.passesAALarge} />
                    <LevelBadge level="AAA" pass={result.passesAAALarge} />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm">UI components</dt>
                  <dd className="flex items-center gap-2">
                    <LevelBadge level="AA" pass={result.ratio >= 3} />
                  </dd>
                </div>
              </dl>
            )}
          </div>

          {/* Closest colours that pass */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
                  Smart suggestions
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Closest colours that pass {level}
                </p>
              </div>
              <div
                role="group"
                aria-label="Suggestion level"
                className="inline-flex rounded-full border border-border p-0.5"
              >
                {(["AA", "AAA"] as const).map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    aria-pressed={level === lv}
                    onClick={() => setLevel(lv)}
                    className={
                      "rounded-full px-4 py-1.5 text-sm font-medium transition-colors " +
                      (level === lv
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground")
                    }
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </div>

            {!result ? (
              <p className="text-sm text-muted-foreground">
                Enter valid colours to see suggestions.
              </p>
            ) : SUGGESTIONS[level].every((r) => result.ratio >= r.target) ? (
              <div className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm">
                <CircleCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <span className="text-success-text">
                  Your colours already pass every {level} contrast requirement —
                  no changes needed.
                </span>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {SUGGESTIONS[level]
                  .filter((row) => result.ratio < row.target)
                  .map((row) => {
                    const suggested = suggestPassing(
                      fgRgb as RGB,
                      bgRgb as RGB,
                      row.target
                    );
                    const hex = suggested ? toHex(suggested) : null;
                    return (
                  <li
                    key={row.sc + row.name}
                    className="flex items-center gap-4 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">
                        {row.sc} {row.name}{" "}
                        <span className="font-normal text-muted-foreground">
                          ({row.level})
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.lines
                          .map((l) => `${l.label} (${l.ratio})`)
                          .join("  |  ")}
                      </p>
                    </div>
                    {hex ? (
                      <>
                        <span
                          className="h-8 w-8 shrink-0 rounded-md border border-border"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                        <span className="w-20 shrink-0 font-mono text-sm">{hex}</span>
                        <button
                          type="button"
                          onClick={() => copy(hex)}
                          aria-label={`Copy ${hex}`}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          {copied === hex ? (
                            <Check className="h-4 w-4 text-success" aria-hidden="true" />
                          ) : (
                            <Copy className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="max-w-[13rem] shrink-0 text-right text-xs leading-snug text-muted-foreground">
                        No foreground reaches {row.target}:1 on this background —
                        try a lighter or darker background.
                      </span>
                    )}
                  </li>
                    );
                  })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center gap-4 border-t border-border/60 px-4 py-3 text-sm sm:px-5">
        <span className="mr-auto inline-flex items-center gap-1.5 text-muted-foreground">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Calculations based on WCAG 2.2
        </span>
        <button
          type="button"
          onClick={exportResult}
          disabled={!result}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export result
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Polite announcements for screen readers (updated on demand). */}
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
