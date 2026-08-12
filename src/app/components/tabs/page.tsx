import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TabsPageClient } from "./tabs-page-client";

export const metadata = pageMetadata({
  title: "Accessible Tabs",
  description:
    "Learn how to build an accessible Tabs with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/tabs",
});

export default function TabsPage() {
  return (
    <ComponentDetailShell slug="tabs">
      <TabsPageClient />
    </ComponentDetailShell>
  );
}
