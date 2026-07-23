import Link from "next/link";
import { getCriterion } from "@/lib/wcag";
import { Badge } from "@/components/ui/badge";

export function ScTable({ scIds }: { scIds: string[] }) {
  const rows = scIds.map(getCriterion).filter(Boolean);

  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          WCAG 2.2 success criteria that apply to this component
        </caption>
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              SC
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Name
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Level
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Why it applies
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c!.id} className="border-t border-border">
              <th
                scope="row"
                className="whitespace-nowrap px-4 py-3 font-mono font-medium"
              >
                <Link
                  href={`/wcag#${c!.id}`}
                  className="underline decoration-dotted underline-offset-2 hover:text-accent"
                >
                  {c!.id}
                </Link>
              </th>
              <td className="px-4 py-3">{c!.name}</td>
              <td className="px-4 py-3">
                <Badge tone={c!.level === "A" ? "neutral" : "accent"}>
                  {c!.level}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {c!.summary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
