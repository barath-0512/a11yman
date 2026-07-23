"use client";

/**
 * Self-contained "Skip Link" demo. A skip link is just a native anchor whose
 * href points at the id of the main content region — there's no ARIA involved.
 * Two details make it work:
 *  1. It is visually hidden until it receives keyboard focus (sr-only +
 *     focus:not-sr-only), so it never clutters the visual design but is the
 *     first thing a keyboard user reaches.
 *  2. Its target carries tabindex={-1} so that activating the link moves
 *     keyboard FOCUS there (not merely the scroll position) — the next Tab
 *     then continues from the main content, past the repeated navigation.
 *
 * The link here targets a demo region scoped to this component, so it works
 * independently of the site's own sitewide skip link in the layout.
 */
export function SkipLinkPattern() {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-4">
      <a
        href="#skip-demo-main"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10"
      >
        Skip to main content
      </a>

      <nav aria-label="Demo navigation" className="mb-4 flex flex-wrap gap-1">
        {["Home", "Products", "Docs", "Pricing", "Blog"].map((label) => (
          <a
            key={label}
            href="#"
            onClick={(e) => e.preventDefault()}
            className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {label}
          </a>
        ))}
      </nav>

      <div
        id="skip-demo-main"
        tabIndex={-1}
        className="rounded-xl border border-border bg-secondary/40 p-4 text-sm"
      >
        <p className="font-medium text-foreground">Main content</p>
        <p className="mt-1 text-muted-foreground">
          Press Tab from the very top of this demo: the &ldquo;Skip to main
          content&rdquo; link appears first. Activating it moves focus straight
          here, bypassing the five demo navigation links above.
        </p>
      </div>
    </div>
  );
}
