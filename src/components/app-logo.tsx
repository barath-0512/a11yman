/**
 * a11yman brand mark — the Tamil letter "அ" (the first letter of the Tamil
 * alphabet: an "a" for a11yman). Rendered as text so it stays crisp at any size,
 * tinted with the accent token to match the wordmark's blue and adapt to theme.
 * Decorative: it sits beside the "a11yman" wordmark, which supplies the name.
 */
export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="44 47 168 203"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <text
        x="128"
        y="183"
        fill="hsl(var(--accent))"
        fontFamily="'Noto Sans Tamil', 'Tamil Sangam MN', Latha, sans-serif"
        fontSize="176"
        fontWeight="600"
        textAnchor="middle"
      >
        அ
      </text>
    </svg>
  );
}
