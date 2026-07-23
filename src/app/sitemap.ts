import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { COMPONENTS } from "@/lib/components-data";
import { ARIA_ATTRIBUTES, ARIA_ROLES } from "@/lib/aria";
import { TESTING_GUIDES } from "@/lib/testing-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/components",
    "/aria",
    "/how-to-test",
    "/how-to-test/cheat-sheet",
    "/contrast-checker",
    "/wcag",
    "/keyboard-reference",
    "/screen-reader-guide",
    "/about",
  ];

  const dynamicRoutes = [
    ...COMPONENTS.map((c) => `/components/${c.slug}`),
    ...ARIA_ATTRIBUTES.map((a) => `/aria/${a.name}`),
    ...ARIA_ROLES.map((r) => `/aria/${r.name}`),
    ...TESTING_GUIDES.map((g) => `/how-to-test/${g.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
