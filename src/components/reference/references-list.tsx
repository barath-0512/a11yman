import { ExternalLink } from "lucide-react";
import { getCriterion } from "@/lib/wcag";

export function ReferencesList({
  apgUrl,
  scIds,
}: {
  apgUrl: string;
  scIds: string[];
}) {
  const criteria = scIds.map(getCriterion).filter(Boolean);
  return (
    <ul className="space-y-2 text-sm">
      <li>
        <a
          href={apgUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-accent underline decoration-dotted underline-offset-2"
        >
          WAI-ARIA Authoring Practices Guide pattern
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </li>
      {criteria.map((c) => (
        <li key={c!.id}>
          <a
            href={c!.understandingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-accent underline decoration-dotted underline-offset-2"
          >
            Understanding {c!.id} {c!.name}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
