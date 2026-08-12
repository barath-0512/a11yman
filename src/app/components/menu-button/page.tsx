import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { MenuButtonPageClient } from "./menu-button-page-client";

export const metadata = pageMetadata({
  title: "Accessible Menu & Menu Button Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Menu & Menu Button with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/menu-button",
});

export default function MenuButtonPage() {
  return (
    <ComponentDetailShell slug="menu-button">
      <MenuButtonPageClient />
    </ComponentDetailShell>
  );
}
