import * as React from "react";

/**
 * Live-demo wrapper. The "Broken example" variant was removed, so this now
 * simply renders the working demo. The `broken` prop is accepted but ignored
 * to keep existing call sites working without edits.
 */
export function BrokenFixedToggle({
  fixed,
}: {
  fixed: React.ReactNode;
  broken?: React.ReactNode;
}) {
  return <div className="space-y-4">{fixed}</div>;
}
