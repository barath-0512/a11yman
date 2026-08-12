import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TablePageClient } from "./table-page-client";

export const metadata = pageMetadata({
  title: "Accessible Table",
  description:
    "Learn how to build an accessible Table with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/table",
});

export default function TablePage() {
  return (
    <ComponentDetailShell slug="table">
      <TablePageClient />
    </ComponentDetailShell>
  );
}
