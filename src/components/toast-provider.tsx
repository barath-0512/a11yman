"use client";

import * as React from "react";
import { X } from "lucide-react";

interface ToastItem {
  id: number;
  message: string;
  icon?: React.ReactNode;
  durationMs: number;
}

interface ToastContextValue {
  /** Show a transient, non-modal status message in the top-right corner. */
  show: (
    message: string,
    options?: { durationMs?: number; icon?: React.ReactNode }
  ) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  // Vertical offset so toasts sit just below the sticky header instead of
  // overlapping it. The header height changes across breakpoints (its nav
  // wraps to a second row below `xl`), so we measure it rather than hard-code.
  const [topOffset, setTopOffset] = React.useState(72);
  const nextId = React.useRef(0);

  React.useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => {
      // The header is sticky at top: 0, so its bounding bottom equals its
      // rendered height — the point just under it, in viewport coordinates.
      setTopOffset(header.getBoundingClientRect().bottom + 12);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = React.useCallback(
    (
      message: string,
      options?: { durationMs?: number; icon?: React.ReactNode }
    ) => {
      const id = nextId.current++;
      // Each toast owns its own auto-dismiss countdown (see ToastCard) so it
      // can pause on hover/focus. The toast is non-modal and never steals
      // focus; it's announced via the always-present live region below.
      setToasts((prev) => [
        ...prev,
        { id, message, icon: options?.icon, durationMs: options?.durationMs ?? 6000 },
      ]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* The live region wrapper is ALWAYS in the DOM (even when empty) so that
          content injected into it is reliably announced — many screen readers
          ignore a region that is added and populated in the same paint. */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{ top: topOffset }}
        className="pointer-events-none fixed right-4 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            toast={toast}
            onDismiss={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * A single toast with a self-managed auto-dismiss countdown. Hovering (or
 * focusing anything inside) pauses the timer so it can be read at leisure;
 * moving away — or blurring — resumes it with the time that was left, exactly
 * where it paused. This is also the WCAG 2.2.1 (Timing Adjustable) pattern.
 */
function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const remainingRef = React.useRef(toast.durationMs);
  const startedAtRef = React.useRef(0);
  const timerRef = React.useRef<number | undefined>(undefined);

  const clear = React.useCallback(() => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const resume = React.useCallback(() => {
    clear();
    startedAtRef.current = Date.now();
    timerRef.current = window.setTimeout(onDismiss, remainingRef.current);
  }, [clear, onDismiss]);

  const pause = React.useCallback(() => {
    if (timerRef.current === undefined) return;
    clear();
    // Bank however much of the countdown is left so resume() picks up here.
    remainingRef.current = Math.max(
      0,
      remainingRef.current - (Date.now() - startedAtRef.current)
    );
  }, [clear]);

  React.useEffect(() => {
    resume();
    return clear;
  }, [resume, clear]);

  return (
    <div
      role="status"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-sm shadow-soft-lg"
    >
      {toast.icon && (
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent-text"
        >
          {toast.icon}
        </span>
      )}
      <p className="flex-1 leading-relaxed">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
