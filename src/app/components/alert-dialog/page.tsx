import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { AlertDialogPageClient } from "./alert-dialog-page-client";

export const metadata = pageMetadata({
  title: "Alert & Alert Dialog",
  description:
    "WCAG 2.2 AA reference for the Alert Dialog pattern: role=\"alertdialog\", least-destructive-action focus, hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/alert-dialog",
});

export default function AlertDialogPage() {
  return (
    <ComponentDetailShell slug="alert-dialog">
      <AlertDialogPageClient />
    </ComponentDetailShell>
  );
}
