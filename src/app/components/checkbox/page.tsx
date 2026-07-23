import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { CheckboxPageClient } from "./checkbox-page-client";

export const metadata = pageMetadata({
  title: "Checkbox",
  description:
    "WCAG 2.2 AA reference for the Checkbox pattern (including tri-state/mixed): native input, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/checkbox",
});

export default function CheckboxPage() {
  return (
    <ComponentDetailShell slug="checkbox">
      <CheckboxPageClient />
    </ComponentDetailShell>
  );
}
