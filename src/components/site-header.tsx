"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, ArrowRight } from "lucide-react";
import { AppLogo } from "@/components/app-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ModeToggle } from "@/components/mode-toggle";
import { GlobalSearchCombobox } from "@/components/global-search";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

const NAV: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Components", href: "/components" },
  { label: "ARIA", href: "/aria" },
  { label: "How to test", href: "/how-to-test" },
  { label: "About", href: "/about" },
];

const SEARCH_QUICK_LINKS: NavLink[] = [
  { label: "Browse components", href: "/components" },
  { label: "ARIA reference", href: "/aria" },
  { label: "How to test", href: "/how-to-test" },
  { label: "Colour contrast checker", href: "/contrast-checker" },
  { label: "WCAG index", href: "/wcag" },
];

// Popular one-tap searches shown as chips under the search input.
const SEARCH_CHIPS: NavLink[] = [
  { label: "button", href: "/components/button" },
  { label: "combobox", href: "/components/combobox" },
  { label: "aria-expanded", href: "/aria/aria-expanded" },
  { label: "dialog", href: "/components/dialog" },
  { label: "2.4.3", href: "/wcag#2.4.3" },
  { label: "aria-labelledby", href: "/aria/aria-labelledby" },
  { label: "1.4.3", href: "/wcag#1.4.3" },
  { label: "carousel", href: "/components/carousel" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  // The Developer / Tester mode only changes content on component pages, so the
  // toggle is only shown across the /components section (an honest affordance).
  const showModeToggle = pathname.startsWith("/components");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchPanelRef = React.useRef<HTMLDivElement>(null);
  // Whether the search flyout was opened via keyboard — decides if the focused
  // input shows a visible focus ring (keyboard) or not (mouse).
  const searchOpenedViaKeyboard = React.useRef(false);
  const lastSearchLinkRef = React.useRef<HTMLAnchorElement>(null);
  const headerRef = React.useRef<HTMLElement>(null);
  const menuId = "mobile-nav-menu";
  const searchId = "header-search-panel";

  // Close the mobile menu and search panel after navigating to a new route.
  React.useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // While the search panel is open: Escape closes it (returning focus to its
  // trigger), and a click outside the header dismisses it.
  React.useEffect(() => {
    if (!searchOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    }
    function onPointerDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    // The panel overlays the (blurred) page, so lock body scroll while it's open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [searchOpen]);

  // The search panel is always in the DOM (so its open/close CSS transitions
  // always run). Keep it out of the tab order / a11y tree while collapsed via
  // `inert`, and move focus into the input when it opens.
  React.useEffect(() => {
    const panel = searchPanelRef.current;
    if (panel) panel.inert = !searchOpen;
    if (searchOpen) {
      // Only show the input's focus ring when the flyout was opened via the
      // keyboard; mouse users get focus without the visible indicator.
      document.getElementById("header-search")?.focus({
        focusVisible: searchOpenedViaKeyboard.current,
      } as FocusOptions);
    }
  }, [searchOpen]);

  // While the menu is open: Escape closes it (returning focus to the toggle,
  // per the Disclosure pattern), and a click outside the header dismisses it.
  React.useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function onPointerDown(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Blurred backdrop behind the search overlay. Sits above the page but
          below the header (z-40), so the bar and panel stay sharp while the body
          is dimmed and blurred. It fades in with a delay so the blur lands after
          the panel has finished expanding. Clicking it dismisses the search. */}
      <div
        aria-hidden="true"
        onClick={() => setSearchOpen(false)}
        style={{ transitionDelay: searchOpen ? "220ms" : "0ms" }}
        className={cn(
          "fixed inset-0 z-30 bg-background/40 backdrop-blur-sm transition-opacity duration-300 ease-out",
          searchOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full border-b border-border/60 glass"
      >
      <div className="container relative flex min-h-16 items-center justify-between gap-3 py-2">
        {/* Left: hamburger (mobile only) + logo */}
        <div className="flex items-center gap-2">
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Navigation menu"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => {
              setMenuOpen((open) => !open);
              setSearchOpen(false);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary xl:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 rounded-lg text-2xl font-semibold tracking-tight"
            aria-label="a11yman home"
          >
            <AppLogo className="h-[2.3em] w-auto shrink-0" />
            <span>
              a<span className="text-accent">11</span>yman
            </span>
          </Link>
        </div>

        {/* Desktop inline navigation (xl and up). Absolutely centred in the
            header so its position stays fixed regardless of the right-side
            controls (e.g. the mode toggle that only shows on /components). */}
        <nav
          aria-label="Main navigation"
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 xl:flex"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "bg-accent/10 text-foreground ring-2 ring-inset ring-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: mode toggle (desktop only) + theme toggle (always). On
            mobile, only the logo and theme button remain in the bar; the mode
            toggle moves into the hamburger menu below. */}
        <div className="flex shrink-0 items-center gap-2">
          {showModeToggle && (
            <div className="hidden xl:block">
              <ModeToggle />
            </div>
          )}
          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls={searchId}
            // Keep focus put on mousedown so clicking the trigger while the panel
            // is open doesn't blur-close it first and then re-open on click.
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              const willOpen = !searchOpen;
              // Keyboard-activated clicks (Enter/Space) report detail === 0;
              // mouse clicks report >= 1.
              searchOpenedViaKeyboard.current = e.detail === 0;
              setSearchOpen(willOpen);
              setMenuOpen(false);
              if (!willOpen) searchButtonRef.current?.focus();
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Search panel. Overlays the (blurred) page below the bar rather than
          pushing content down, sliding + fading in. The input auto-focuses on
          open, Escape closes it, and it collapses when keyboard focus leaves the
          panel — after the last quick link, Tab collapses it and moves focus to
          the theme toggle. */}
      <div
        ref={searchPanelRef}
        id={searchId}
        onBlur={(e) => {
          if (
            searchOpen &&
            !e.currentTarget.contains(e.relatedTarget as Node) &&
            e.relatedTarget !== searchButtonRef.current
          ) {
            setSearchOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const active = document.activeElement;
          // Forward past the last quick link: collapse, focus the theme toggle.
          if (!e.shiftKey && active === lastSearchLinkRef.current) {
            e.preventDefault();
            setSearchOpen(false);
            document.getElementById("theme-toggle-button")?.focus();
          } else if (e.shiftKey && active?.id === "header-search") {
            // Backward past the search input: collapse, focus the search button.
            e.preventDefault();
            setSearchOpen(false);
            searchButtonRef.current?.focus();
          }
        }}
        style={{ transformOrigin: "top" }}
        className={cn(
          "absolute inset-x-0 top-full z-40 border-b border-border/60 bg-background shadow-soft-lg transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          searchOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
          <div className="container py-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Find what you need, instantly
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search components, ARIA roles &amp; attributes, and WCAG criteria.
            </p>
            <div className="mt-5 max-w-2xl">
              <GlobalSearchCombobox instanceId="header-search" />
            </div>

            <ul className="mt-4 flex flex-wrap gap-2">
              {SEARCH_CHIPS.map((chip) => (
                <li key={chip.label}>
                  <Link
                    href={chip.href}
                    onClick={() => setSearchOpen(false)}
                    className="inline-flex rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                  >
                    {chip.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Quick links
              </p>
              <ul className="mt-3 space-y-1">
                {SEARCH_QUICK_LINKS.map((item, i) => (
                  <li key={item.href}>
                    <Link
                      ref={
                        i === SEARCH_QUICK_LINKS.length - 1
                          ? lastSearchLinkRef
                          : undefined
                      }
                      href={item.href}
                      onClick={() => setSearchOpen(false)}
                      className="group inline-flex items-center gap-2 rounded py-1 font-medium text-foreground transition-colors hover:text-accent-text"
                    >
                      <ArrowRight
                        className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>

      {/* Mobile hamburger menu. Always rendered (so aria-controls always
          resolves) but hidden until opened, and never shown at xl+. */}
      <div id={menuId} hidden={!menuOpen} className="border-t border-border/60 xl:hidden">
        <nav
          aria-label="Main navigation"
          className="container flex flex-col gap-1 py-3"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "bg-accent/10 text-foreground ring-2 ring-inset ring-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Developer / Tester mode selector, relocated into the menu on mobile.
            Only shown across the /components section, like the desktop toggle. */}
        {showModeToggle && (
          <div className="container border-t border-border/60 py-3">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              View mode
            </span>
            <ModeToggle />
          </div>
        )}
      </div>
      </header>
    </>
  );
}
