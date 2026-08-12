import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ListboxPageClient } from "./listbox-page-client";

export const metadata = pageMetadata({
  title: "Accessible Listbox Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Listbox with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/listbox",
});

export default function ListboxPage() {
  return (
    <ComponentDetailShell slug="listbox">
      <ListboxPageClient />
    </ComponentDetailShell>
  );
}
