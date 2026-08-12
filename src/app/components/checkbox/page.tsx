import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { CheckboxPageClient } from "./checkbox-page-client";

export const metadata = pageMetadata({
  title: "Accessible Checkbox",
  description:
    "Learn how to build an accessible Checkbox with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/checkbox",
});

export default function CheckboxPage() {
  return (
    <ComponentDetailShell slug="checkbox">
      <CheckboxPageClient />
    </ComponentDetailShell>
  );
}
