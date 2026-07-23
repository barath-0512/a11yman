"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = ["New file", "Duplicate", "Rename", "Move to trash"];

/**
 * Hand-coded APG "Menu Button" pattern. Unlike a dialog, a menu is not
 * modal — Tab closes it and moves on to the next focusable page element
 * rather than being trapped, per APG guidance.
 */
export function MenuButtonPattern() {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = "menu-button-pattern-menu";

  function openMenu(focusIndex: number) {
    setOpen(true);
    setActiveIndex(focusIndex);
  }

  function closeMenu(restoreFocus: boolean) {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }

  React.useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenu(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(ITEMS.length - 1);
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % ITEMS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(ITEMS.length - 1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu(true);
    } else if (e.key === "Tab") {
      // Menus are not modal: Tab closes it and continues to the next
      // focusable page element instead of being trapped.
      closeMenu(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      closeMenu(true);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? closeMenu(false) : openMenu(0))}
        onKeyDown={onButtonKeyDown}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium"
      >
        Actions
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label="Actions"
          onKeyDown={onMenuKeyDown}
          className="absolute left-0 z-10 mt-2 w-48 rounded-2xl border border-border bg-card p-1 shadow-soft-lg"
        >
          {ITEMS.map((item, i) => (
            <li key={item} role="none">
              <button
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="menuitem"
                tabIndex={-1}
                onClick={() => closeMenu(true)}
                onMouseEnter={() => setActiveIndex(i)}
                className="block w-full rounded-lg px-4 py-2 text-left text-sm hover:bg-secondary"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
