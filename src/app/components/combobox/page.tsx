import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ComboboxPageClient } from "./combobox-page-client";

export const metadata = pageMetadata({
  title: "Combobox",
  description:
    "WCAG 2.2 AA reference for the Combobox (list autocomplete) pattern: native datalist, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/combobox",
});

export default function ComboboxPage() {
  return (
    <ComponentDetailShell slug="combobox">
      <ComboboxPageClient />
    </ComponentDetailShell>
  );
}
