import { linkifyAria } from "./linkify-aria";

export interface AriaRow {
  target: string;
  attribute: string;
  why: string;
}

export function AriaTable({ rows }: { rows: AriaRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Required roles, states, and properties
        </caption>
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Element
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Attribute
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Why
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                {linkifyAria(r.target)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                {linkifyAria(r.attribute)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {linkifyAria(r.why)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
