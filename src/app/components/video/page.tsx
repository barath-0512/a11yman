import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { VideoPageClient } from "./video-page-client";

export const metadata = pageMetadata({
  title: "Accessible Video Player Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Video Player with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/video",
});

export default function VideoPage() {
  return (
    <ComponentDetailShell slug="video">
      <VideoPageClient />
    </ComponentDetailShell>
  );
}
