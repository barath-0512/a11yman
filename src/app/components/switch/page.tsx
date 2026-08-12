import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SwitchPageClient } from "./switch-page-client";

export const metadata = pageMetadata({
  title: "Accessible Switch Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Switch with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/switch",
});

export default function SwitchPage() {
  return (
    <ComponentDetailShell slug="switch">
      <SwitchPageClient />
    </ComponentDetailShell>
  );
}
