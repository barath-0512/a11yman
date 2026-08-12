import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { SliderPageClient } from "./slider-page-client";

export const metadata = pageMetadata({
  title: "Accessible Slider",
  description:
    "Learn how to build an accessible Slider with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/slider",
});

export default function SliderPage() {
  return (
    <ComponentDetailShell slug="slider">
      <SliderPageClient />
    </ComponentDetailShell>
  );
}
