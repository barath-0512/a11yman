import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { VideoPageClient } from "./video-page-client";

export const metadata = pageMetadata({
  title: "Video Player",
  description:
    "WCAG 2.2 AA reference for an accessible video player: native controls, synchronized captions (WebVTT), a text transcript, audio-description support, keyboard model, screen reader announcements, and test cases.",
  path: "/components/video",
});

export default function VideoPage() {
  return (
    <ComponentDetailShell slug="video">
      <VideoPageClient />
    </ComponentDetailShell>
  );
}
