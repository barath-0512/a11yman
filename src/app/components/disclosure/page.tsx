import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DisclosurePageClient } from "./disclosure-page-client";

export const metadata = pageMetadata({
  title: "Disclosure",
  description:
    "WCAG 2.2 AA reference for the Disclosure (Show/Hide) pattern: native details/summary, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/disclosure",
});

export default function DisclosurePage() {
  return (
    <ComponentDetailShell slug="disclosure">
      <DisclosurePageClient />
    </ComponentDetailShell>
  );
}
