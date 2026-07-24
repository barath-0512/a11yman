/**
 * a11yman brand mark — the Tamil letter "அ" (the first letter of the Tamil
 * alphabet: an "a" for a11yman). It sits beside the "a11yman" wordmark, which
 * supplies the name, so it is decorative.
 *
 * The glyph is baked in as a vector <path> (extracted from Noto Sans Tamil
 * SemiBold, the font the brand stack intends) rather than rendered from a live
 * font. A live <text> glyph is font-dependent: every OS substitutes a different
 * Tamil face — Mac (Tamil Sangam MN ≈ 1.39 wide), Windows (Nirmala UI), Linux
 * (a condensed fallback ≈ 0.81) — so no single tight viewBox can frame them all,
 * and the glyph was being clipped on Windows/Mac. The outline path renders
 * identically everywhere and never clips. Tinted with the accent token so it
 * matches the wordmark's blue and adapts to theme.
 */
export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 296 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="hsl(var(--accent))"
        d="M86.6 194.6Q58.4 194.6 39.1 187.7Q19.8 180.8 9.9 168.6Q0 156.4 0 140.4Q0 132.9 3.1 125.9Q6.2 118.9 13.3 114.0Q17.0 111.4 22.0 109.6Q27.0 107.9 34.5 107.0Q41.9 106.2 53.1 106.2H263.7L263.8 131.9H56.2Q50.2 131.9 46.5 132.2Q42.8 132.5 40.8 133.2Q38.7 134.0 37.0 135.3Q33.6 138.4 33.6 143.3Q33.6 154.7 47.4 161.7Q61.1 168.7 90.1 168.7H93.9Q121.8 168.7 141.4 162.3Q160.9 155.9 173.4 144.7Q185.8 133.6 191.9 119.8L192.8 113.0Q194.6 107.1 195.3 101.1Q196.0 95.1 196.0 89.5Q196.0 73.8 191.1 60.2Q186.3 46.7 175.9 37.4Q165.5 28.1 148.7 25.4Q145.5 24.8 142.2 24.7Q138.8 24.5 135.6 24.5Q127.5 24.5 120.7 26.8Q113.9 29.1 109.7 34.1Q105.5 39.1 105.5 47.8Q105.5 57.0 110.8 62.7Q116.0 68.5 125.6 68.5Q134.0 68.5 139.6 63.2Q145.2 57.9 145.2 45.8Q145.2 35.8 141.1 27.7Q137.0 19.5 130.6 12.4L154.5 7.8Q159.3 12.0 163.6 17.8Q167.9 23.7 170.7 31.3Q173.5 38.9 173.5 48.6Q173.5 58.3 170.6 66.4Q167.7 74.5 161.6 80.6Q155.6 86.7 146.2 90.0Q136.8 93.3 123.9 93.3Q110.4 93.3 99.1 88.4Q87.8 83.5 80.9 73.7Q74.1 63.9 74.1 49.3Q74.1 31.8 82.7 21.0Q91.3 10.2 105.6 5.1Q119.9 0 137.1 0Q160.4 0 177.7 7.3Q194.9 14.7 206.5 27.4Q218.1 40.0 223.8 55.9Q229.5 71.8 229.5 88.9Q229.5 95.4 228.7 101.6Q228.0 107.8 226.7 113.7L226.1 122.2Q218.0 145.2 199.2 161.3Q180.3 177.4 153.0 186.0Q125.7 194.6 91.8 194.6ZM261.5 200V3.3H296.0V200Z"
      />
    </svg>
  );
}
