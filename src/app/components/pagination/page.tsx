import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { PaginationPageClient } from "./pagination-page-client";

export const metadata = pageMetadata({
  title: "Pagination",
  description:
    "WCAG 2.2 AA reference for the Pagination pattern: server-rendered links vs. JS-driven controls, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/pagination",
});

export default function PaginationPage() {
  return (
    <ComponentDetailShell slug="pagination">
      <PaginationPageClient />
    </ComponentDetailShell>
  );
}
