import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { RadioGroupPageClient } from "./radio-group-page-client";

export const metadata = pageMetadata({
  title: "Accessible Radio Group",
  description:
    "Learn how to build an accessible Radio Group with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/radio-group",
});

export default function RadioGroupPage() {
  return (
    <ComponentDetailShell slug="radio-group">
      <RadioGroupPageClient />
    </ComponentDetailShell>
  );
}
