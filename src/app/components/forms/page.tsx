import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { FormsPageClient } from "./forms-page-client";

export const metadata = pageMetadata({
  title: "Accessible Form patterns",
  description:
    "Learn how to build an accessible Form patterns with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/forms",
});

export default function FormsPage() {
  return (
    <ComponentDetailShell slug="forms">
      <FormsPageClient />
    </ComponentDetailShell>
  );
}
