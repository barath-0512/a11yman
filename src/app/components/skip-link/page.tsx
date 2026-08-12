import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SkipLinkPageClient } from "./skip-link-page-client";

export const metadata = pageMetadata({
  title: "Accessible Skip Link",
  description:
    "Learn how to build an accessible Skip Link with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/skip-link",
});

export default function SkipLinkPage() {
  return (
    <ComponentDetailShell slug="skip-link">
      <SkipLinkPageClient />
    </ComponentDetailShell>
  );
}
