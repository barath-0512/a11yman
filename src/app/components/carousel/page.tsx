import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { CarouselPageClient } from "./carousel-page-client";

export const metadata = pageMetadata({
  title: "Carousel",
  description:
    "WCAG 2.2 AA reference for the Carousel pattern: no native equivalent, hand-coded ARIA with a pausable autoplay, keyboard model, screen reader announcements, and test cases.",
  path: "/components/carousel",
});

export default function CarouselPage() {
  return (
    <ComponentDetailShell slug="carousel">
      <CarouselPageClient />
    </ComponentDetailShell>
  );
}
