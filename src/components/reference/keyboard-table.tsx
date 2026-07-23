export interface KeyboardRow {
  keys: string;
  behavior: string;
}

export function KeyboardTable({ rows }: { rows: KeyboardRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Keyboard interaction model</caption>
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Key
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Behavior
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.keys} className="border-t border-border">
              <th
                scope="row"
                className="whitespace-nowrap px-4 py-3 font-mono font-medium"
              >
                <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-xs">
                  {r.keys}
                </kbd>
              </th>
              <td className="px-4 py-3 text-muted-foreground">
                {r.behavior}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
