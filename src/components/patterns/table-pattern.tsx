"use client";

import * as React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  name: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
}

const DATA: Person[] = [
  { name: "Amara Okafor", role: "Engineer", status: "Active", lastActive: "2026-07-01" },
  { name: "Priya Natarajan", role: "Designer", status: "Active", lastActive: "2026-06-29" },
  { name: "Diego Fuentes", role: "Product Manager", status: "Invited", lastActive: "—" },
  { name: "Wren Callahan", role: "Engineer", status: "Suspended", lastActive: "2026-05-14" },
  { name: "Sofia Marchetti", role: "Support", status: "Active", lastActive: "2026-07-02" },
];

type SortKey = "name" | "status";
type SortDirection = "ascending" | "descending" | "none";

/**
 * Hand-coded sortable data table using a real <table>.
 *
 * Roles/attributes and why they exist:
 * - <caption>: gives the table an accessible name/purpose, announced by
 *   screen readers before they enter the table (SC 1.3.1 Info and
 *   Relationships). Visually present here, but could be visually-hidden
 *   with a sr-only class if a heading right above the table already
 *   states its purpose.
 * - <th scope="col">: associates each header cell with every data cell in
 *   its column, so a screen reader user who jumps to any cell also hears
 *   the relevant column header (e.g. "Active, Status").
 * - aria-sort="ascending"|"descending"|"none" on the sortable <th>: tells
 *   assistive tech the CURRENT sort state of that column. This lives on
 *   the header cell itself (not the button inside it) because that's
 *   where APG/ARIA spec says a UA should look for table sort state.
 * - The sort control is a real <button> nested inside the <th>, not the
 *   whole header cell wired to onClick. A <th> is not natively focusable
 *   or operable, so making only the inner button interactive keeps this
 *   keyboard accessible and gives it an unambiguous accessible name.
 */
export function TablePattern() {
  const [sortKey, setSortKey] = React.useState<SortKey>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("ascending");

  const sorted = React.useMemo(() => {
    if (sortDirection === "none") return DATA;
    const copy = [...DATA];
    copy.sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDirection === "ascending" ? cmp : -cmp;
    });
    return copy;
  }, [sortKey, sortDirection]);

  function toggleSort(key: SortKey) {
    if (key !== sortKey) {
      setSortKey(key);
      setSortDirection("ascending");
      return;
    }
    setSortDirection((prev) =>
      prev === "ascending" ? "descending" : prev === "descending" ? "none" : "ascending"
    );
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    return sortKey === key ? sortDirection : "none";
  }

  function SortIcon({ state }: { state: "ascending" | "descending" | "none" }) {
    if (state === "ascending") return <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />;
    if (state === "descending") return <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />;
    return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />;
  }

  function sortLabel(colName: string, key: SortKey) {
    const state = ariaSortFor(key);
    const current =
      state === "ascending"
        ? "currently sorted ascending"
        : state === "descending"
          ? "currently sorted descending"
          : "not sorted";
    return `Sort by ${colName}, ${current}`;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="border-b border-border bg-secondary/40 px-4 py-2 text-left text-xs text-muted-foreground">
          Team members and their current account status
        </caption>
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th scope="col" aria-sort={ariaSortFor("name")} className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => toggleSort("name")}
                aria-label={sortLabel("Name", "name")}
                className="inline-flex items-center gap-1.5 rounded"
              >
                Name
                <SortIcon state={ariaSortFor("name")} />
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Role
            </th>
            <th scope="col" aria-sort={ariaSortFor("status")} className="px-4 py-3 font-semibold">
              <button
                type="button"
                onClick={() => toggleSort("status")}
                aria-label={sortLabel("Status", "status")}
                className="inline-flex items-center gap-1.5 rounded"
              >
                Status
                <SortIcon state={ariaSortFor("status")} />
              </button>
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Last active
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((person) => (
            <tr key={person.name} className="border-t border-border">
              {/* Row header: scope="row" lets a cell-by-cell screen reader
                  user hear "Amara Okafor" announced alongside every other
                  cell in this row, not just the column headers. */}
              <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-medium">
                {person.name}
              </th>
              <td className="px-4 py-3 text-muted-foreground">{person.role}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    person.status === "Active" && "bg-success/15 text-success-text",
                    person.status === "Invited" && "bg-accent/15 text-accent-text",
                    person.status === "Suspended" && "bg-destructive/15 text-destructive-text"
                  )}
                >
                  {person.status}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{person.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
