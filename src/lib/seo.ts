import type { Metadata } from "next";
import { SITE_NAME, SITE_TITLE } from "@/lib/site";

/**
 * Build per-page metadata with a self-referencing canonical URL and per-page
 * OpenGraph / Twitter tags. Those social tags do NOT inherit the root layout's
 * title template, so we set them explicitly here.
 *
 * - `title` is the bare page title; the root layout appends " | a11yman" to the
 *   document <title>. For social cards we build the full title ourselves.
 * - `path` is the route (leading slash), used for the canonical + og:url.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const ogTitle = path === "/" ? SITE_TITLE : `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
