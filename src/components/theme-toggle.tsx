"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const current = theme === "system" ? resolvedTheme : theme;
  const isDark = current === "dark";

  // Keep a stable label/output until mounted to avoid hydration mismatch,
  // since the resolved theme is only known on the client.
  const label = !mounted
    ? "Toggle theme"
    : isDark
      ? "Switch to light mode"
      : "Switch to dark mode";

  return (
    <button
      id="theme-toggle-button"
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Moon className="h-5 w-5" aria-hidden="true" />
        )
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
