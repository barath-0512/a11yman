import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { AlertDialogPageClient } from "./alert-dialog-page-client";

export const metadata = pageMetadata({
  title: "Accessible Alert & Alert Dialog",
  description:
    "Learn how to build an accessible Alert & Alert Dialog with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/alert-dialog",
});

export default function AlertDialogPage() {
  return (
    <ComponentDetailShell slug="alert-dialog">
      <AlertDialogPageClient />
    </ComponentDetailShell>
  );
}
