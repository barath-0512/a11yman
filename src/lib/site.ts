// Central site configuration used across metadata, sitemap, and layout chrome.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://a11yman.com"
).replace(/\/$/, "");

export const SITE_NAME = "a11yman";

export const SITE_TAGLINE = "Build • Test • Ship Accessible";

export const SITE_TITLE =
  "a11yman – Accessibility Components, ARIA & WCAG Examples";

export const SITE_DESCRIPTION =
  "a11yman is a practical, test-oriented reference for building and auditing WCAG 2.2 AA compliant UI components: ARIA roles/states, keyboard models, focus management, screen reader announcements, and ready-to-use test cases.";

export const SITE_KEYWORDS = [
  "WCAG 2.2",
  "ARIA patterns",
  "WAI-ARIA authoring practices",
  "accessibility testing",
  "screen reader testing",
  "keyboard accessibility",
  "a11y component library",
  "accessibility audit",
  "Section 508",
];

export const APG_VERSION = "WAI-ARIA APG 1.2";
export const WCAG_VERSION = "WCAG 2.2";

// Search-engine site-verification tokens (rendered as <meta> tags). Read at
// server render time; set them as environment variables at deploy.
// - Google Search Console: Settings → Ownership verification → HTML tag.
// - Bing Webmaster Tools: Verify ownership → Option 1 (HTML meta tag).
export const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION ||
  "xgUCplAEIK1-2SpDD0l9oMa9kCcg79FNyzqAZbEx8So";
export const BING_SITE_VERIFICATION =
  process.env.BING_SITE_VERIFICATION || undefined;
