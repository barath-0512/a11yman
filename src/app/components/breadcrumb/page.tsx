import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { BreadcrumbPageClient } from "./breadcrumb-page-client";

export const metadata = pageMetadata({
  title: "Breadcrumb",
  description:
    "WCAG 2.2 AA reference for the Breadcrumb pattern: labeled nav landmark, ordered list of links, aria-current, and test cases.",
  path: "/components/breadcrumb",
});

export default function BreadcrumbPage() {
  return (
    <ComponentDetailShell slug="breadcrumb">
      <BreadcrumbPageClient />
    </ComponentDetailShell>
  );
}
