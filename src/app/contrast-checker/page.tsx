import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContrastAnalyser } from "@/components/contrast-analyser";
import { randomPreviewQuote } from "@/lib/preview-quotes";

// Pick a fresh preview line on every request so it changes on each reload and
// is baked straight into the HTML (no client-side swap / flash of a default).
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Color Contrast Checker",
  description:
    "Check any foreground/background colour pair against WCAG 2.2 contrast requirements — live ratio, AA/AAA pass-fail, a preview, and the closest colours that pass.",
  path: "/contrast-checker",
});

export default function ContrastAnalyserPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main
        id="main"
        className="container flex min-h-[calc(100dvh-3rem)] flex-col justify-center pb-8 pt-4"
      >
        <div className="mx-auto w-full max-w-5xl space-y-3">
          <Link
            href="/how-to-test"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            How to test
          </Link>
          <div className="space-y-1">
            <h1 className="flex items-center gap-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              <Sparkles
                className="h-6 w-6 shrink-0 text-accent sm:h-7 sm:w-7"
                aria-hidden="true"
              />
              <span>
                <span className="text-accent">Smart</span> color contrast checker
              </span>
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Check any foreground/background pair against WCAG 2.2 — live ratio,
              AA/AAA results, a preview, and the closest colours that still pass.
            </p>
          </div>

          <ContrastAnalyser initialQuote={randomPreviewQuote()} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
