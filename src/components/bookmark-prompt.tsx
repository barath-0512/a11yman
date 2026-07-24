"use client";

import * as React from "react";
import { Bookmark, X } from "lucide-react";

/**
 * A gentle, dismissible "bookmark this site" nudge that slides in at the
 * bottom-right after the visitor has stayed on the site for a minute.
 *
 * Persistence model (all client-side):
 * - `a11yman-bookmarked` in localStorage: set the moment we detect the browser
 *   bookmark shortcut (Ctrl/⌘+D) anywhere on the site. Once set, the prompt is
 *   NEVER shown again, on any future visit. (There is no web API to read the
 *   actual bookmark state, so the keyboard shortcut is the best available
 *   proxy — we never preventDefault it, so the real bookmark dialog still opens.)
 * - `a11yman-bookmark-dismissed` in sessionStorage: set when the visitor
 *   dismisses the prompt. Suppresses it for the rest of that browsing session,
 *   but it may reappear on a fresh visit until they bookmark.
 *
 * Accessibility:
 * - Non-modal role="dialog" (aria-modal="false"): it never steals focus, so a
 *   keyboard or screen-reader user reading the page a minute in is not yanked
 *   away. It is labelled + described, reachable in the Tab order, and its
 *   appearance is announced politely via a visually-hidden live region.
 * - Dismiss via the close button or the Escape key (when focus is inside it).
 * - Entrance animation is purely CSS transform/opacity, so the site's global
 *   prefers-reduced-motion rule neutralises it automatically.
 */

const BOOKMARKED_KEY = "a11yman-bookmarked";
const DISMISSED_KEY = "a11yman-bookmark-dismissed";
const DELAY_MS = 60_000; // one minute

/**
 * Desktop-only: the prompt teaches a physical-keyboard shortcut (Ctrl/⌘+D),
 * which is meaningless on phones and touch tablets. We require a wide viewport
 * AND a fine, hover-capable pointer — that excludes phones and touch tablets
 * (coarse pointer) while allowing mouse/trackpad-driven laptops and desktops.
 */
function isDesktopPointer(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(
    "(min-width: 1024px) and (hover: hover) and (pointer: fine)"
  ).matches;
}

export function BookmarkPrompt() {
  const [open, setOpen] = React.useState(false);
  const [entered, setEntered] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    // Never prompt again once the site has been bookmarked.
    let bookmarked = false;
    try {
      bookmarked = localStorage.getItem(BOOKMARKED_KEY) === "1";
    } catch {
      // localStorage unavailable (e.g. privacy mode) — just skip the feature.
      return;
    }

    // Detect the bookmark shortcut anywhere, anytime — even before the prompt
    // has shown — so a visitor who bookmarks early is never nudged.
    function onKeyDown(e: KeyboardEvent) {
      const isBookmarkShortcut =
        (e.metaKey || e.ctrlKey) &&
        !e.shiftKey &&
        !e.altKey &&
        (e.key === "d" || e.key === "D");
      if (!isBookmarkShortcut) return;
      try {
        localStorage.setItem(BOOKMARKED_KEY, "1");
      } catch {
        /* ignore */
      }
      bookmarked = true;
      setOpen(false);
      // Note: we deliberately do NOT preventDefault — let the browser open its
      // real bookmark dialog.
    }
    window.addEventListener("keydown", onKeyDown);

    let showTimer: ReturnType<typeof setTimeout> | undefined;
    if (!bookmarked) {
      let dismissed = false;
      try {
        dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
      } catch {
        /* ignore */
      }
      if (!dismissed && isDesktopPointer()) {
        showTimer = setTimeout(() => {
          // Re-check in case they bookmarked, or resized to a small/touch
          // viewport, during the wait.
          if (bookmarked || !isDesktopPointer()) return;
          setOpen(true);
          setAnnouncement(
            "a11yman. Enjoying this site? Bookmark it for quick access — press Control D, or Command D on Mac."
          );
        }, DELAY_MS);
      }
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  // Trigger the slide-in on the frame after mount so the transition runs.
  React.useEffect(() => {
    if (!open) {
      setEntered(false);
      return;
    }
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  function dismiss() {
    setOpen(false);
    setAnnouncement("");
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {/* Politely announces the prompt's arrival without moving focus. */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {open && (
        <div
          data-nosnippet
          role="dialog"
          aria-modal="false"
          aria-labelledby="bookmark-prompt-title"
          aria-describedby="bookmark-prompt-desc"
          onKeyDown={(e) => {
            if (e.key === "Escape") dismiss();
          }}
          className={
            "fixed bottom-4 right-4 z-[90] w-[calc(100vw-2rem)] max-w-xs rounded-2xl border border-border bg-card p-4 pr-10 text-card-foreground shadow-soft-lg transition-all duration-300 ease-out " +
            (entered
              ? "translate-y-0 opacity-100"
              : "translate-y-3 opacity-0")
          }
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss bookmark reminder"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-text"
            >
              <Bookmark className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p
                id="bookmark-prompt-title"
                className="text-sm font-semibold tracking-tight"
              >
                Love a<span className="text-accent">11</span>yman?
              </p>
              <p id="bookmark-prompt-desc" className="text-sm text-muted-foreground">
                Bookmark it for quick access.
              </p>
              <p className="pt-1 text-xs text-muted-foreground">
                Press <Kbd>Ctrl</Kbd> + <Kbd>D</Kbd>{" "}
                <span className="whitespace-nowrap">
                  (or <Kbd>⌘</Kbd> + <Kbd>D</Kbd> on Mac)
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md border border-border bg-secondary px-1.5 py-0.5 font-sans text-[0.7rem] font-medium text-foreground">
      {children}
    </kbd>
  );
}
