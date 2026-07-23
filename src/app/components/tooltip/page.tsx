import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TooltipPageClient } from "./tooltip-page-client";

export const metadata = pageMetadata({
  title: "Tooltip",
  description:
    "WCAG 2.2 AA reference for the Tooltip pattern: role=\"tooltip\", aria-describedby, hover-and-focus triggering, SC 1.4.13 dismissible/hoverable/persistent requirements, and test cases.",
  path: "/components/tooltip",
});

export default function TooltipPage() {
  return (
    <ComponentDetailShell slug="tooltip">
      <TooltipPageClient />
    </ComponentDetailShell>
  );
}
