import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SkipLinkPageClient } from "./skip-link-page-client";

export const metadata = pageMetadata({
  title: "Skip Link",
  description:
    "WCAG 2.2 AA reference for the Skip Link (skip to main content) pattern: implementation, keyboard model, screen reader announcements, WCAG 2.4.1 Bypass Blocks, and test cases.",
  path: "/components/skip-link",
});

export default function SkipLinkPage() {
  return (
    <ComponentDetailShell slug="skip-link">
      <SkipLinkPageClient />
    </ComponentDetailShell>
  );
}
