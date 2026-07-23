import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TablePageClient } from "./table-page-client";

export const metadata = pageMetadata({
  title: "Table",
  description:
    "WCAG 2.2 AA reference for the sortable data Table pattern: native table with caption/scope, ARIA sort state, the div-based ARIA grid alternative, keyboard model, screen reader announcements, and test cases.",
  path: "/components/table",
});

export default function TablePage() {
  return (
    <ComponentDetailShell slug="table">
      <TablePageClient />
    </ComponentDetailShell>
  );
}
