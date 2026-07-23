import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { NavigationPageClient } from "./navigation-page-client";

export const metadata = pageMetadata({
  title: "Navigation",
  description:
    "WCAG 2.2 AA reference for site Navigation: landmark structure, skip links, aria-current, and test cases.",
  path: "/components/navigation",
});

export default function NavigationPage() {
  return (
    <ComponentDetailShell slug="navigation">
      <NavigationPageClient />
    </ComponentDetailShell>
  );
}
