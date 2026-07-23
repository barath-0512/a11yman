import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SwitchPageClient } from "./switch-page-client";

export const metadata = pageMetadata({
  title: "Switch",
  description:
    "WCAG 2.2 AA reference for the Switch pattern: role=\"switch\" hand-coded ARIA, native checkbox caveats, keyboard model, screen reader announcements, and test cases.",
  path: "/components/switch",
});

export default function SwitchPage() {
  return (
    <ComponentDetailShell slug="switch">
      <SwitchPageClient />
    </ComponentDetailShell>
  );
}
