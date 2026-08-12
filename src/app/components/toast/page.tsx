import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ToastPageClient } from "./toast-page-client";

export const metadata = pageMetadata({
  title: "Accessible Toast / Status messages Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Toast / Status messages with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/toast",
});

export default function ToastPage() {
  return (
    <ComponentDetailShell slug="toast">
      <ToastPageClient />
    </ComponentDetailShell>
  );
}
