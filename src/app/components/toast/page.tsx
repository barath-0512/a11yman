import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ToastPageClient } from "./toast-page-client";

export const metadata = pageMetadata({
  title: "Toast / Status messages",
  description:
    "WCAG 2.2 AA reference for the Toast / Status messages pattern: aria-live regions, role=\"status\" vs role=\"alert\", persistent live regions, hand-coded implementation, and test cases.",
  path: "/components/toast",
});

export default function ToastPage() {
  return (
    <ComponentDetailShell slug="toast">
      <ToastPageClient />
    </ComponentDetailShell>
  );
}
