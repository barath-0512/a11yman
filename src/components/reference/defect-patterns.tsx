import { Badge } from "@/components/ui/badge";
import { linkifyAria } from "./linkify-aria";

export interface DefectItem {
  defect: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  description: string;
}

const SEVERITY_TONE = {
  Critical: "destructive",
  High: "warning",
  Medium: "accent",
  Low: "neutral",
} as const;

export function DefectPatterns({ items }: { items: DefectItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="rounded-2xl border border-border bg-card p-4"
        >
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <Badge tone={SEVERITY_TONE[item.severity]}>
              {item.severity}
            </Badge>
            <span className="font-medium">{linkifyAria(item.defect)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Sample defect text:{" "}
            </span>
            {linkifyAria(item.description)}
          </p>
        </li>
      ))}
    </ul>
  );
}
