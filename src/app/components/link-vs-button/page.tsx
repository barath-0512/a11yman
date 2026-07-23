import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { LinkVsButtonPageClient } from "./link-vs-button-page-client";

export const metadata = pageMetadata({
  title: "Link vs. Button",
  description:
    "WCAG 2.2 AA reference for choosing between a hyperlink and a button: the most common real-world accessibility defect pattern.",
  path: "/components/link-vs-button",
});

export default function LinkVsButtonPage() {
  return (
    <ComponentDetailShell slug="link-vs-button">
      <LinkVsButtonPageClient />
    </ComponentDetailShell>
  );
}
