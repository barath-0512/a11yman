import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { PaginationPageClient } from "./pagination-page-client";

export const metadata = pageMetadata({
  title: "Accessible Pagination Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Pagination with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/pagination",
});

export default function PaginationPage() {
  return (
    <ComponentDetailShell slug="pagination">
      <PaginationPageClient />
    </ComponentDetailShell>
  );
}
