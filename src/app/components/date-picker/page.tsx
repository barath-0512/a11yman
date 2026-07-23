import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DatePickerPageClient } from "./date-picker-page-client";

export const metadata = pageMetadata({
  title: "Date Picker",
  description:
    "WCAG 2.2 AA reference for the Date Picker dialog pattern: native input type=\"date\", a hand-coded ARIA grid dialog with full keyboard support, screen reader announcements, and test cases.",
  path: "/components/date-picker",
});

export default function DatePickerPage() {
  return (
    <ComponentDetailShell slug="date-picker">
      <DatePickerPageClient />
    </ComponentDetailShell>
  );
}
