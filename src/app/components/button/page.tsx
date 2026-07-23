import { pageMetadata } from "@/lib/seo";
import { ComponentDetailShell } from "@/components/reference/component-detail-shell";
import { ButtonPageClient } from "./button-page-client";

export const metadata = pageMetadata({
  title: "Button",
  description:
    "WCAG 2.2 AA reference for the Button pattern, including toggle buttons: native <button>, aria-pressed, keyboard model, screen reader announcements, and test cases.",
  path: "/components/button",
});

export default function ButtonPage() {
  return (
    <ComponentDetailShell slug="button">
      <ButtonPageClient />
    </ComponentDetailShell>
  );
}
