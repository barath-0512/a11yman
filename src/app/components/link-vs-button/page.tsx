import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { LinkVsButtonPageClient } from "./link-vs-button-page-client";

export const metadata = pageMetadata({
  title: "Accessible Link vs. Button Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Link vs. Button with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/link-vs-button",
});

export default function LinkVsButtonPage() {
  return (
    <ComponentDetailShell slug="link-vs-button">
      <LinkVsButtonPageClient />
    </ComponentDetailShell>
  );
}
