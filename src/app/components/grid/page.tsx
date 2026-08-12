import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { GridPageClient } from "./grid-page-client";

export const metadata = pageMetadata({
  title: "Accessible Grid (interactive data grid)",
  description:
    "Learn how to build an accessible Grid (interactive data grid) with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/grid",
});

export default function GridPage() {
  return (
    <ComponentDetailShell slug="grid">
      <GridPageClient />
    </ComponentDetailShell>
  );
}
