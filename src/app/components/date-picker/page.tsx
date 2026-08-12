import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DatePickerPageClient } from "./date-picker-page-client";

export const metadata = pageMetadata({
  title: "Accessible Date Picker",
  description:
    "Learn how to build an accessible Date Picker with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/date-picker",
});

export default function DatePickerPage() {
  return (
    <ComponentDetailShell slug="date-picker">
      <DatePickerPageClient />
    </ComponentDetailShell>
  );
}
