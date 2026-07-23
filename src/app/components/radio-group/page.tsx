import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { RadioGroupPageClient } from "./radio-group-page-client";

export const metadata = pageMetadata({
  title: "Radio Group",
  description:
    "WCAG 2.2 AA reference for the Radio Group pattern: native input, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/radio-group",
});

export default function RadioGroupPage() {
  return (
    <ComponentDetailShell slug="radio-group">
      <RadioGroupPageClient />
    </ComponentDetailShell>
  );
}
