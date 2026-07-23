/**
 * ⚠ Deliberately broken breadcrumb — for learning only.
 *
 * Defects, on purpose:
 * 1. No <nav aria-label="Breadcrumb"> wrapper — a screen reader's landmark
 *    list has no "Breadcrumb navigation" entry at all; the trail reads as
 *    an anonymous list indistinguishable from any other list on the page.
 * 2. The current page ("ThinkPad X1") is still a clickable <a href>, and
 *    it carries no aria-current="page" — nothing tells AT users, or a
 *    "current page" CSS selector, which crumb represents where they are.
 * 3. The "/" separators are plain text nodes inside each list item, so a
 *    screen reader reads "slash" aloud between every single crumb.
 */
export function BreadcrumbPatternBroken() {
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-sm">
      <li className="flex items-center gap-1.5">
        <a
          href="/"
          onClick={(e) => e.preventDefault()}
          className="text-accent underline decoration-dotted underline-offset-2"
        >
          Home
        </a>
        <span className="text-muted-foreground">/</span>
      </li>
      <li className="flex items-center gap-1.5">
        <a
          href="/products"
          onClick={(e) => e.preventDefault()}
          className="text-accent underline decoration-dotted underline-offset-2"
        >
          Products
        </a>
        <span className="text-muted-foreground">/</span>
      </li>
      <li className="flex items-center gap-1.5">
        <a
          href="/products/laptops"
          onClick={(e) => e.preventDefault()}
          className="text-accent underline decoration-dotted underline-offset-2"
        >
          Laptops
        </a>
        <span className="text-muted-foreground">/</span>
      </li>
      <li>
        <a
          href="/products/laptops/thinkpad-x1"
          onClick={(e) => e.preventDefault()}
          className="text-accent underline decoration-dotted underline-offset-2"
        >
          ThinkPad X1
        </a>
      </li>
    </ol>
  );
}
