import Link from "next/link";
import { CHEATSHEET } from "@/lib/testing-cheatsheet";

/**
 * The accessibility testing cheat sheet, rendered as a proper data table:
 * a <caption>, column headers with scope="col", and each row's test name as a
 * scope="row" header. The wrapper is a focusable scroll region so keyboard
 * users can reach the horizontal overflow on narrow screens.
 */
export function CheatSheetTable() {
  return (
    <div
      role="region"
      aria-label="Accessibility testing cheat sheet, scrollable"
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-border"
    >
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <caption className="sr-only">
          Step-by-step accessibility testing cheat sheet: for each check, how to
          test it, the expected result, and the mapped WCAG success criteria.
        </caption>
        <thead>
          <tr className="bg-secondary/70 text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="w-10 px-3 py-3 text-center font-semibold">
              #
            </th>
            <th scope="col" className="w-40 px-3 py-3 font-semibold">
              Test
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              How to test
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Expected result
            </th>
            <th scope="col" className="w-44 px-3 py-3 font-semibold">
              WCAG SC
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {CHEATSHEET.map((r) => (
            <tr key={r.n} className="align-top even:bg-secondary/25">
              <td className="px-3 py-3 text-center font-mono text-xs text-muted-foreground">
                {r.n}
              </td>
              <th scope="row" className="px-3 py-3 font-semibold">
                {r.test}
              </th>
              <td className="px-3 py-3 text-muted-foreground">{r.how}</td>
              <td className="px-3 py-3 text-muted-foreground">{r.expected}</td>
              <td className="px-3 py-3">
                <ul className="space-y-1">
                  {r.sc.map((s) =>
                    s.id ? (
                      <li key={s.id}>
                        <Link
                          href={`/wcag#${s.id}`}
                          className="group/sc inline-flex items-baseline gap-1.5 rounded hover:underline"
                        >
                          <span className="font-mono text-xs font-semibold text-accent-text">
                            {s.id}
                          </span>
                          {s.name && (
                            <span className="text-xs text-muted-foreground group-hover/sc:text-foreground">
                              {s.name}
                            </span>
                          )}
                        </Link>
                      </li>
                    ) : (
                      <li key={s.name} className="text-xs text-muted-foreground">
                        {s.name}
                      </li>
                    )
                  )}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
