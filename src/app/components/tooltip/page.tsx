import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TooltipPageClient } from "./tooltip-page-client";

export const metadata = pageMetadata({
  title: "Accessible Tooltip",
  description:
    "Learn how to build an accessible Tooltip with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/tooltip",
});

export default function TooltipPage() {
  return (
    <ComponentDetailShell slug="tooltip">
      <TooltipPageClient />
    </ComponentDetailShell>
  );
}
