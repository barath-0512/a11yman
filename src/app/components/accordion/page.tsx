import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { AccordionPageClient } from "./accordion-page-client";

export const metadata = pageMetadata({
  title: "Accessible Accordion Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Accordion with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/accordion",
});

export default function AccordionPage() {
  return (
    <ComponentDetailShell slug="accordion">
      <AccordionPageClient />
    </ComponentDetailShell>
  );
}
