/**
 * WCAG 2.x colour-contrast math (pure, framework-free). Powers the
 * Colour Contrast Analyser. Formulas per the WCAG 2.2 definition of
 * "contrast ratio" and "relative luminance".
 */
export type RGB = [number, number, number];

export function parseHex(hex: string): RGB | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function toHex(rgb: RGB): string {
  return (
    "#" +
    rgb
      .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function channelLuminance(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function relativeLuminance([r, g, b]: RGB): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function round(rgb: RGB): RGB {
  return [Math.round(rgb[0]), Math.round(rgb[1]), Math.round(rgb[2])];
}

/**
 * The colour closest to `fg` (keeping its hue by blending along a straight
 * line) that meets `target` contrast against `bg`.
 * - If `fg` already passes, returns the boundary colour nearest the background
 *   (i.e. "you can go this close to the background and still pass").
 * - If `fg` fails, returns the nearest colour toward black/white that passes.
 * - Returns null if the target is unreachable on this background.
 */
export function suggestPassing(fg: RGB, bg: RGB, target: number): RGB | null {
  // Walk the fg→(dir) line and test the ACTUAL rounded 8-bit colour at each
  // step, so the colour we return is guaranteed to pass after rounding (a float
  // boundary can round back onto a failing colour, e.g. 118.5 → 119).
  const STEPS = 512;

  if (contrastRatio(fg, bg) >= target) {
    // fg already passes: return the colour closest to the background that still
    // passes once rounded — "how close to the background you can go".
    let best = round(fg);
    for (let i = 1; i <= STEPS; i++) {
      const c = round(mix(fg, bg, i / STEPS));
      if (contrastRatio(c, bg) >= target) best = c;
      else break;
    }
    return best;
  }

  // fg fails: push toward whichever extreme gives more contrast on this bg,
  // returning the first rounded colour that actually passes.
  const black: RGB = [0, 0, 0];
  const white: RGB = [255, 255, 255];
  const ext: RGB =
    contrastRatio(black, bg) >= contrastRatio(white, bg) ? black : white;
  if (contrastRatio(ext, bg) < target) return null;
  for (let i = 1; i <= STEPS; i++) {
    const c = round(mix(fg, ext, i / STEPS));
    if (contrastRatio(c, bg) >= target) return c;
  }
  return round(ext);
}

export interface ContrastResult {
  ratio: number;
  /** Highest level the ratio satisfies for normal text. */
  level: "AAA" | "AA" | "AA Large" | "Fail";
  passesAANormal: boolean;
  passesAALarge: boolean;
  passesAAANormal: boolean;
  passesAAALarge: boolean;
}

export function evaluate(fg: RGB, bg: RGB): ContrastResult {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio,
    level:
      ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail",
    passesAANormal: ratio >= 4.5,
    passesAALarge: ratio >= 3,
    passesAAANormal: ratio >= 7,
    passesAAALarge: ratio >= 4.5,
  };
}
