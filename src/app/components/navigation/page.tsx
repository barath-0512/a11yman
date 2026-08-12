import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { NavigationPageClient } from "./navigation-page-client";

export const metadata = pageMetadata({
  title: "Accessible Navigation Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Navigation with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/navigation",
});

export default function NavigationPage() {
  return (
    <ComponentDetailShell slug="navigation">
      <NavigationPageClient />
    </ComponentDetailShell>
  );
}
