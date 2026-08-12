import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { CarouselPageClient } from "./carousel-page-client";

export const metadata = pageMetadata({
  title: "Accessible Carousel Example – HTML, ARIA & WCAG",
  description:
    "Learn how to build an accessible Carousel with semantic HTML, keyboard support, focus states, accessible names, ARIA, and WCAG requirements.",
  path: "/components/carousel",
});

export default function CarouselPage() {
  return (
    <ComponentDetailShell slug="carousel">
      <CarouselPageClient />
    </ComponentDetailShell>
  );
}
