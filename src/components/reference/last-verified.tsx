import { APG_VERSION, WCAG_VERSION } from "@/lib/site";

export function LastVerified({ date }: { date: string }) {
  return (
    <p className="text-xs text-muted-foreground">
      Last verified against {WCAG_VERSION} and {APG_VERSION} on {date}.
    </p>
  );
}
