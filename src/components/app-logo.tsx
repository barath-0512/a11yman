/**
 * a11yman brand mark — a rounded tile with a bold "A." monogram. It sits beside
 * the "a11yman" wordmark, which supplies the name, so it is decorative.
 *
 * Theme-aware by design: the tile is painted with the foreground token and the
 * letter with the background token, so it renders as a dark tile with a light
 * "A" in light mode and inverts (light tile, dark "A") in dark mode. The accent
 * dot stays brand-blue in both. The "A" is a baked vector path (Inter
 * ExtraBold, the site's own typeface) rather than a live font glyph, so it
 * renders identically on every platform and never clips.
 */
export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Rounded tile */}
      <rect
        x="0"
        y="0"
        width="120"
        height="120"
        rx="30"
        ry="30"
        fill="hsl(var(--foreground))"
      />
      {/* Bold "A" (Inter ExtraBold outline) */}
      <path
        transform="translate(23 32) scale(0.56)"
        fill="hsl(var(--background))"
        d="M0 100 34.4 0H66.2L100.7 100H73.8L60.2 56.1Q57.0 45.0 53.7 33.8Q50.5 22.6 47.1 9.5H53.7Q50.2 22.6 46.9 33.8Q43.6 45.0 40.2 56.1L26.2 100ZM23.6 80.8V61.9H77.2V80.8Z"
      />
      {/* Accent dot — the "." after the A */}
      <circle cx="89" cy="80.5" r="7.5" fill="hsl(var(--accent))" />
    </svg>
  );
}
