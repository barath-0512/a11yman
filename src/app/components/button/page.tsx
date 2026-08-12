import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ButtonPageClient } from "./button-page-client";

export const metadata = pageMetadata({
  title: "Accessible Button Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Button with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/button",
});

export default function ButtonPage() {
  return (
    <ComponentDetailShell slug="button">
      <ButtonPageClient />
    </ComponentDetailShell>
  );
}
