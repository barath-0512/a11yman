import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { MenuButtonPageClient } from "./menu-button-page-client";

export const metadata = pageMetadata({
  title: "Menu & Menu Button",
  description:
    "WCAG 2.2 AA reference for the Menu Button pattern: hand-coded ARIA menu, keyboard model, screen reader announcements, and test cases.",
  path: "/components/menu-button",
});

export default function MenuButtonPage() {
  return (
    <ComponentDetailShell slug="menu-button">
      <MenuButtonPageClient />
    </ComponentDetailShell>
  );
}
