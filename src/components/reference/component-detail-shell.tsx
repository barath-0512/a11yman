import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ComponentSidebar } from "@/components/reference/component-sidebar";

/**
 * Page chrome for every component detail page: sticky header, a two-column
 * body (component list sidebar on the left, page content on the right), and
 * the footer. The left pane collapses below `lg`.
 */
export function ComponentDetailShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
          <ComponentSidebar activeSlug={slug} />
          <div className="min-w-0">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
