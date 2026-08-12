import { linkifyAria } from "./linkify-aria";

export interface ProcedureStep {
  action: string;
  expected: string;
}

export function TestProcedure({ steps }: { steps: ProcedureStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent-text"
            >
              {i + 1}
            </span>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Do: </span>
                {linkifyAria(step.action)}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Expect: </span>
                {linkifyAria(step.expected)}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
