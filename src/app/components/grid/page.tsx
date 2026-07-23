import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { GridPageClient } from "./grid-page-client";

export const metadata = pageMetadata({
  title: "Grid (interactive data grid)",
  description:
    "WCAG 2.2 AA reference for the ARIA grid pattern: role=\"grid\" with two-dimensional arrow-key cell navigation, roving tabindex, the keyboard model (arrows, Home/End, Ctrl+Home/End), screen reader announcements, defect patterns, and test cases — and when to use it instead of a plain Table.",
  path: "/components/grid",
});

export default function GridPage() {
  return (
    <ComponentDetailShell slug="grid">
      <GridPageClient />
    </ComponentDetailShell>
  );
}
