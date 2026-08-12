import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { DialogPageClient } from "./dialog-page-client";

export const metadata = pageMetadata({
  title: "Accessible Dialog (Modal)",
  description:
    "Learn how to build an accessible Dialog (Modal) with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/dialog",
});

export default function DialogPage() {
  return (
    <ComponentDetailShell slug="dialog">
      <DialogPageClient />
    </ComponentDetailShell>
  );
}
