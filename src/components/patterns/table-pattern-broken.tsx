"use client";

import * as React from "react";

const DATA = [
  { name: "Amara Okafor", role: "Engineer", status: "Active" },
  { name: "Priya Natarajan", role: "Designer", status: "Active" },
  { name: "Diego Fuentes", role: "Product Manager", status: "Invited" },
  { name: "Wren Callahan", role: "Engineer", status: "Suspended" },
];

/**
 * ⚠ Deliberately broken data table — for learning only.
 *
 * Defects, on purpose:
 * 1. No <caption> — a screen reader user landing on this table gets no
 *    statement of its purpose before navigating into it. Fails SC 1.3.1.
 * 2. Data cells have no header association at all: header row uses plain
 *    <td> instead of <th scope="col">, and there is no row header either.
 *    A screen reader user who jumps directly to a cell (common table
 *    navigation via NVDA/JAWS Ctrl+Alt+Arrow) hears just the raw value —
 *    e.g. "Active" — with no idea which row or column it belongs to.
 *    Fails SC 1.3.1 and 4.1.2.
 * 3. The sort control is the entire header <div onClick>, not a real
 *    <button>. It cannot receive keyboard focus and has no default
 *    Enter/Space activation, so keyboard users cannot sort at all.
 *    Fails SC 2.1.1 and 4.1.2.
 * 4. No aria-sort anywhere — even a sighted mouse user has no
 *    programmatic indication of current sort state, and there's no way
 *    for AT to announce it.
 */
export function TablePatternBroken() {
  const [sorted, setSorted] = React.useState(false);
  const rows = sorted ? [...DATA].sort((a, b) => a.name.localeCompare(b.name)) : DATA;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <tbody>
          <tr className="bg-secondary/60 text-left">
            {/* A div wrapped in onClick instead of a real, focusable button. */}
            <td className="px-4 py-3 font-semibold">
              <div onClick={() => setSorted((s) => !s)} className="cursor-pointer">
                Name
              </div>
            </td>
            <td className="px-4 py-3 font-semibold">Role</td>
            <td className="px-4 py-3 font-semibold">Status</td>
          </tr>
          {rows.map((person) => (
            <tr key={person.name} className="border-t border-border">
              <td className="px-4 py-3">{person.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{person.role}</td>
              <td className="px-4 py-3 text-muted-foreground">{person.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
