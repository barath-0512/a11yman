import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DisclosurePageClient } from "./disclosure-page-client";

export const metadata = pageMetadata({
  title: "Accessible Disclosure",
  description:
    "Learn how to build an accessible Disclosure with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/disclosure",
});

export default function DisclosurePage() {
  return (
    <ComponentDetailShell slug="disclosure">
      <DisclosurePageClient />
    </ComponentDetailShell>
  );
}
