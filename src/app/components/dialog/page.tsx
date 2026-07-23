import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DialogPageClient } from "./dialog-page-client";

export const metadata = pageMetadata({
  title: "Dialog (Modal)",
  description:
    "WCAG 2.2 AA reference for the Dialog (Modal) pattern: native <dialog>, hand-coded ARIA, focus trap, keyboard model, screen reader announcements, and test cases.",
  path: "/components/dialog",
});

export default function DialogPage() {
  return (
    <ComponentDetailShell slug="dialog">
      <DialogPageClient />
    </ComponentDetailShell>
  );
}
