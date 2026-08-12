import { pageMetadata } from "@/lib/seo";
import {
  Accessibility,
  BadgeCheck,
  ClipboardCheck,
  Code2,
  Lightbulb,
  Mail,
  ScanText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Why this WCAG 2.2 AA component reference exists — a direct, test-oriented alternative to dense accessibility documentation — and about the maker.",
  path: "/about",
});

const MODES = [
  {
    icon: Code2,
    title: "Developer mode",
    body: "Live interactive demo, full source with a copy button, the required ARIA roles and states, the keyboard interaction model, and focus-management rules.",
  },
  {
    icon: ClipboardCheck,
    title: "Tester mode",
    body: "Step-by-step keyboard test procedures, expected screen reader announcements for JAWS, NVDA and VoiceOver, mapped WCAG success criteria, and ready-to-paste defect descriptions.",
  },
];

const HIGHLIGHTS = [
  {
    icon: Accessibility,
    title: "Accessibility, end to end",
    body: "8+ years making web, mobile, and documents work for everyone — WCAG 2.1/2.2, Section 508, and ADA.",
  },
  {
    icon: Code2,
    title: "Accessibility + dev",
    body: "I don't just file issues — I get into the code and give real, practical remediation guidance developers can ship.",
  },
  {
    icon: ScanText,
    title: "Screen readers all day",
    body: "JAWS, NVDA, VoiceOver, TalkBack, Narrator — certified on JAWS & NVDA, and IAAP Web Accessibility Specialist.",
  },
  {
    icon: Smartphone,
    title: "Every platform",
    body: "Web, iOS, macOS, Android, Windows, even TV and Web OS. If people use it, it should be accessible.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="main" tabIndex={-1} className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Why this site exists */}
          <section aria-labelledby="why" className="space-y-5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lightbulb className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Why this exists
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Why I built{" "}
              <span className="whitespace-nowrap">
                a<span className="text-accent">11</span>yman
              </span>
            </h1>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                Almost every accessibility reference I've relied on, like the WAI-ARIA Authoring Practices Guide, the WCAG Understanding documents, and Deque University, is a <strong>wall of documentation.</strong> They're thorough, authoritative, and I'm glad they exist. But they're also long. Not everyone has the patience to read through paragraph after paragraph just to find the one ARIA attribute, the keyboard interaction, or the exact screen reader announcement they need at that moment.
              </p>
              <p>
                So I built this site to be the opposite: <strong>direct.</strong> Open any component and you'll immediately find the correct implementation, the required roles and states, keyboard interactions, expected screen reader output, mapped WCAG success criteria, and test cases you can use straight away in an accessibility audit. No digging through pages of documentation.
              </p>
              <p>
                Developers and testers often need different information from the same component, so every component page has a <strong>Developer / Tester mode toggle</strong>. Switch between them whenever you want, and your preference is remembered as you navigate through the site.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MODES.map((m) => (
                <Card key={m.title}>
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <m.icon className="h-5 w-5 text-accent" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="text-sm text-muted-foreground">{m.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* About the maker */}
          <section aria-labelledby="about-me" className="space-y-6">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <ProfileAvatar />
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  IAAP WAS certified
                </span>
                <h2
                  id="about-me"
                  className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  Hey there, I&apos;m Barath
                </h2>
              </div>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I'm an accessibility consultant with 8+ years of experience helping organizations build digital products that actually work for everyone. I partner with developers, designers, testers, and product teams to audit applications, identify accessibility barriers, guide remediation, and ensure compliance with standards like WCAG and WAI-ARIA. But I'm definitely not the guy who hands you a boring compliance checklist and walks away. Because I think like a developer, I dive into the code, explain the "why" behind every issue, and help teams fix problems instead of just pointing them out.

              </p>
              <p>
                My favorite pastimes include testing stuff with screen readers,
                untangling chaotic accessibility problems, and reminding people
                that inclusive design starts on day one, not day &quot;right
                before launch.&quot; This site is really just that philosophy
                turned into a tool.
              </p>
              <p>
                When I&apos;m not saving the digital world, I&apos;m usually out
                exploring the physical one. I love traveling, hunting down local
                food, and getting lost in new cultures. It&apos;s a great reminder
                that people interact with the world and their screens in totally
                different, beautifully chaotic ways.
              </p>
            </div>
          </section>

          <section aria-labelledby="what-i-do" className="space-y-4">
            <h2 id="what-i-do" className="text-2xl font-semibold tracking-tight">
              A bit about what I do
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {HIGHLIGHTS.map((h) => (
                <Card key={h.title}>
                  <CardContent className="flex gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                      <h.icon
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{h.title}</h3>
                      <p className="text-sm text-muted-foreground">{h.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-5">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              IAAP Web Accessibility Specialist · JAWS &amp; NVDA certified ·
              based in Coimbatore, India. Always happy to talk accessibility.
            </p>
          </section>

          {/* Contact banner */}
          <section
            aria-labelledby="contact"
            className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/[0.12] via-accent/[0.05] to-transparent p-8 shadow-soft sm:p-10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl space-y-2">
                <h2
                  id="contact"
                  className="text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  Have a question about accessibility?
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Have feedback about a
                  <span className="text-accent">11</span>yman, or a question
                  about accessibility? I&apos;d love to hear from you.
                </p>
              </div>
              <a
                href="mailto:hello@a11yman.com"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                hello@a11yman.com
              </a>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
