import { ChevronRight } from "lucide-react";

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Laptops", href: "/products/laptops" },
];
const CURRENT = "ThinkPad X1";

/**
 * Hand-coded APG "Breadcrumb" pattern: a <nav> landmark labeled
 * "Breadcrumb" wrapping an ordered list of links. The last item is the
 * current page — rendered as plain text with aria-current="page" rather
 * than a link, since re-navigating to the page you're already on serves no
 * purpose. Separators are decorative and hidden from assistive tech.
 */
export function BreadcrumbPattern() {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {TRAIL.map((item) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <a
              href={item.href}
              onClick={(e) => e.preventDefault()}
              className="text-accent underline decoration-dotted underline-offset-2"
            >
              {item.label}
            </a>
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            />
          </li>
        ))}
        <li aria-current="page" className="font-medium text-foreground">
          {CURRENT}
        </li>
      </ol>
    </nav>
  );
}
