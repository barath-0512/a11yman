import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SliderPageClient } from "./slider-page-client";

export const metadata = pageMetadata({
  title: "Slider",
  description:
    "WCAG 2.2 AA reference for the Slider pattern: native input[type=range], hand-coded ARIA, keyboard model, screen reader announcements, and test cases.",
  path: "/components/slider",
});

export default function SliderPage() {
  return (
    <ComponentDetailShell slug="slider">
      <SliderPageClient />
    </ComponentDetailShell>
  );
}
