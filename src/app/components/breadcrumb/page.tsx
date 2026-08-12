import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { BreadcrumbPageClient } from "./breadcrumb-page-client";

export const metadata = pageMetadata({
  title: "Accessible Breadcrumb",
  description:
    "Learn how to build an accessible Breadcrumb with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/breadcrumb",
});

export default function BreadcrumbPage() {
  return (
    <ComponentDetailShell slug="breadcrumb">
      <BreadcrumbPageClient />
    </ComponentDetailShell>
  );
}
