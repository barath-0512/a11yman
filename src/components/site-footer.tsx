import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { SITE_TAGLINE, WCAG_VERSION, APG_VERSION } from "@/lib/site";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Reference",
    links: [
      { label: "Components", href: "/components" },
      { label: "ARIA Reference", href: "/aria" },
      { label: "WCAG Index", href: "/wcag" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "How to test", href: "/how-to-test" },
      { label: "Keyboard Reference", href: "/keyboard-reference" },
      { label: "Screen Reader Guide", href: "/screen-reader-guide" },
    ],
  },
  {
    heading: "Tools",
    links: [{ label: "Colour Contrast Checker", href: "/contrast-checker" }],
  },
  {
    heading: "About",
    links: [{ label: "About a11yman", href: "/about" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg text-base"
              aria-label="a11yman home"
            >
              <AppLogo className="h-[2.3em] w-auto shrink-0" />
              <span className="flex flex-col leading-tight">
                <span className="text-base font-semibold tracking-tight">
                  a<span className="text-accent">11</span>yman
                </span>
                <span className="text-xs text-muted-foreground">{SITE_TAGLINE}</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              A practical, test-oriented reference for building, testing, and
              understanding accessible UI — {WCAG_VERSION} AA and {APG_VERSION}.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="mailto:hello@a11yman.com"
                aria-label="Email hello@a11yman.com"
                title="hello@a11yman.com"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://www.linkedin.com/in/barath-kumar-balasubramaniam/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Barath on LinkedIn (opens in a new tab)"
                title="LinkedIn"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                  {col.heading}
                </h2>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} a11yman. Always verify against the
            latest published spec.
          </p>
          <p className="inline-flex items-center gap-1.5">
            Made with{" "}
            <Heart className="h-4 w-4 fill-destructive text-destructive" aria-label="love" />{" "}
            for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
