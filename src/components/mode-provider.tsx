"use client";

import * as React from "react";

export type SiteMode = "developer" | "tester";

const STORAGE_KEY = "a11y-ref-mode";

interface ModeContextValue {
  mode: SiteMode;
  setMode: (mode: SiteMode) => void;
  mounted: boolean;
  /** True on a visitor's first ever visit, until they pick a mode (or dismiss). */
  showOnboarding: boolean;
  /** Hide the onboarding overlay and remember that it's been handled. */
  dismissOnboarding: () => void;
}

const ModeContext = React.createContext<ModeContextValue | undefined>(
  undefined
);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = React.useState<SiteMode>("developer");
  const [mounted, setMounted] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "developer" || stored === "tester") {
      setModeState(stored);
    } else {
      // No stored preference means this is a first-time visitor — greet them.
      setShowOnboarding(true);
    }
    setMounted(true);
  }, []);

  const setMode = React.useCallback((next: SiteMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setAnnouncement(
      next === "developer"
        ? "Developer mode enabled. Showing implementation details."
        : "Tester mode enabled. Showing test procedures and audit content."
    );
  }, []);

  const dismissOnboarding = React.useCallback(() => {
    setShowOnboarding(false);
    // Persist the current mode so the overlay doesn't reappear next visit,
    // even if the visitor dismissed it without explicitly changing modes.
    setModeState((current) => {
      window.localStorage.setItem(STORAGE_KEY, current);
      return current;
    });
  }, []);

  return (
    <ModeContext.Provider
      value={{ mode, setMode, mounted, showOnboarding, dismissOnboarding }}
    >
      {children}
      {/* Announces mode changes to screen reader users without moving focus. */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = React.useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
