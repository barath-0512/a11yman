import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ListboxPageClient } from "./listbox-page-client";

export const metadata = pageMetadata({
  title: "Listbox",
  description:
    "WCAG 2.2 AA reference for the Listbox pattern (single & multi-select): native select, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/listbox",
});

export default function ListboxPage() {
  return (
    <ComponentDetailShell slug="listbox">
      <ListboxPageClient />
    </ComponentDetailShell>
  );
}
