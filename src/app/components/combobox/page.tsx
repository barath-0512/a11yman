import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ComboboxPageClient } from "./combobox-page-client";

export const metadata = pageMetadata({
  title: "Accessible Combobox",
  description:
    "Learn how to build an accessible Combobox with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/combobox",
});

export default function ComboboxPage() {
  return (
    <ComponentDetailShell slug="combobox">
      <ComboboxPageClient />
    </ComponentDetailShell>
  );
}
