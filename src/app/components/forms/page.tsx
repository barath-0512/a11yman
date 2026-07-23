import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { FormsPageClient } from "./forms-page-client";

export const metadata = pageMetadata({
  title: "Form patterns",
  description:
    "WCAG 2.2 AA reference for form patterns: labels, required-field indication, inline errors, a focus-managed error summary, and autocomplete attributes.",
  path: "/components/forms",
});

export default function FormsPage() {
  return (
    <ComponentDetailShell slug="forms">
      <FormsPageClient />
    </ComponentDetailShell>
  );
}
