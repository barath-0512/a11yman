import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { AccordionPageClient } from "./accordion-page-client";

export const metadata = pageMetadata({
  title: "Accordion",
  description:
    "WCAG 2.2 AA reference for the Accordion pattern: native details/summary, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/accordion",
});

export default function AccordionPage() {
  return (
    <ComponentDetailShell slug="accordion">
      <AccordionPageClient />
    </ComponentDetailShell>
  );
}
