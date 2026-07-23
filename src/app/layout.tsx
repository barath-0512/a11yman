import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeProvider } from "@/components/mode-provider";
import { ToastProvider } from "@/components/toast-provider";
import { Onboarding } from "@/components/onboarding";
import { BookmarkPrompt } from "@/components/bookmark-prompt";
import { GoogleAnalytics } from "@/components/google-analytics";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | a11yman",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  category: "technology",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Search-engine ownership verification (only rendered when the tokens are set).
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    ...(BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": BING_SITE_VERIFICATION } }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <ModeProvider>
            <ToastProvider>
              {/* Wrapper the Onboarding overlay can mark `inert` while the
                  welcome dialog is open, so the whole page behind it is
                  removed from the tab order and the accessibility tree —
                  the robust, native way to contain focus in a modal. */}
              <div id="app-shell">
                <a
                  href="#main"
                  className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
                >
                  Skip to content
                </a>
                {children}
                <BookmarkPrompt />
              </div>
              <Onboarding />
            </ToastProvider>
          </ModeProvider>
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
