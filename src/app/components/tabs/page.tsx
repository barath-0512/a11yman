import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { TabsPageClient } from "./tabs-page-client";

export const metadata = pageMetadata({
  title: "Tabs",
  description:
    "WCAG 2.2 AA reference for the Tabs pattern: automatic and manual activation, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/tabs",
});

export default function TabsPage() {
  return (
    <ComponentDetailShell slug="tabs">
      <TabsPageClient />
    </ComponentDetailShell>
  );
}
