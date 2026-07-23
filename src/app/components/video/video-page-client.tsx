"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMode } from "@/components/mode-provider";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/reference/code-block";
import { AriaTable } from "@/components/reference/aria-table";
import { KeyboardTable } from "@/components/reference/keyboard-table";
import { ScTable } from "@/components/reference/sc-table";
import { SrAnnouncementTable } from "@/components/reference/sr-announcement-table";
import { DefectPatterns } from "@/components/reference/defect-patterns";
import { TestChecklist } from "@/components/reference/test-checklist";
import { TestProcedure } from "@/components/reference/test-procedure";
import { PageSection } from "@/components/reference/page-section";
import { LastVerified } from "@/components/reference/last-verified";
import { VideoPattern } from "@/components/patterns/video-pattern";
import { getComponent } from "@/lib/components-data";
import { getCriterion } from "@/lib/wcag";

const meta = getComponent("video")!;

const CODE = `<figure>
  <video controls preload="metadata" poster="poster.svg"
         aria-label="A flower blooming in timelapse, with gentle music">
    <source src="flower.mp4" type="video/mp4" />
    <source src="flower.webm" type="video/webm" />

    <!-- Synchronized captions (WebVTT). \`default\` turns them on;
         \`label\` names the track in the CC menu. -->
    <track kind="captions" src="flower.en.vtt"
           srclang="en" label="English" default />
  </video>
  <figcaption>Sample clip. Captions on by default.</figcaption>
</figure>

<!-- Text transcript — also the media alternative when there is no narration -->
<button aria-expanded="false" aria-controls="transcript">Show transcript</button>
<div id="transcript" role="region" aria-label="Video transcript" hidden>…</div>`;

const ARIA_ROWS = [
  { target: "<video>", attribute: "controls", why: "Exposes the browser's built-in player, whose controls are keyboard-operable and screen-reader-labelled. Prefer these native controls over hand-built ones unless you can fully re-create their accessibility." },
  { target: "<video>", attribute: "aria-label (or a <figure> + <figcaption>)", why: "Gives the player an accessible name that describes the content, so it isn't announced as a bare, unlabelled “video”." },
  { target: "<track>", attribute: 'kind="captions" srclang label default', why: "Adds a synchronized WebVTT caption track. `default` turns it on initially, `label` names it in the CC menu, and captions must include speaker changes and meaningful non-speech sounds — not just dialogue." },
  { target: "<track>", attribute: 'kind="descriptions" · kind="subtitles"', why: "Optional extra tracks: `descriptions` for audio-description text, `subtitles` for translations. Captions (same language, incl. sounds) are not the same as subtitles (translated dialogue only)." },
  { target: "Transcript control", attribute: "Real <button> with aria-expanded + aria-controls", why: "A hand-coded disclosure that reveals the full text transcript — the alternative for people who can't use captions or audio at all (and the media alternative under SC 1.2.3)." },
  { target: "<video>", attribute: "no autoplay (or muted + a pause control)", why: "Audio must not start automatically for more than 3 seconds without a way to stop it (SC 1.4.2). Prefer user-initiated playback." },
];

const KEYBOARD_ROWS = [
  { keys: "Tab / Shift+Tab", behavior: "Moves to the player, then between its native controls (play, mute, timeline, captions, fullscreen), then to the transcript toggle." },
  { keys: "Space / Enter", behavior: "On the player or play button, toggles play/pause; on the captions/fullscreen buttons, activates them." },
  { keys: "Left / Right Arrow", behavior: "With the timeline (or player) focused, seeks backward/forward by a few seconds." },
  { keys: "Up / Down Arrow", behavior: "With the player/volume focused, raises or lowers the volume." },
  { keys: "M · F · C", behavior: "In most browsers, shortcuts for mute, fullscreen, and captions on the focused player. Exact keys vary by browser — the requirement is only that everything is keyboard-operable." },
];

const SR_ROWS = [
  { step: "Focus reaches the video player", jawsChrome: "A flower blooming in timelapse…, video", nvdaFirefox: "A flower blooming in timelapse…, video", voiceOverSafari: "A flower blooming in timelapse…, video" },
  { step: "Play control focused, then activated", jawsChrome: "Play, button → Pause, button", nvdaFirefox: "Play, button → Pause, button", voiceOverSafari: "Play button → Pause button" },
  { step: "“Show transcript” button focused", jawsChrome: "Show transcript, collapsed, button", nvdaFirefox: "Show transcript, button, collapsed", voiceOverSafari: "Show transcript, collapsed, button" },
  { step: "Transcript expanded", jawsChrome: "expanded; Video transcript, region", nvdaFirefox: "expanded; Video transcript, region", voiceOverSafari: "expanded, Video transcript, region" },
];

const DEFECTS = [
  { defect: "No captions track", severity: "Critical" as const, description: "The video has an audio track but no synchronized captions, so Deaf and hard-of-hearing users get nothing from it. Fails SC 1.2.2." },
  { defect: "Auto-generated captions, never reviewed", severity: "High" as const, description: "“Craptions” with wrong words, no punctuation, and no speaker labels. Inaccurate or incomplete captions don't satisfy SC 1.2.2." },
  { defect: "No transcript or media alternative", severity: "High" as const, description: "No text alternative for the media, excluding screen-reader-only and deafblind users and anyone who can't play media. Fails SC 1.2.3 (and 1.2.1 for audio-only)." },
  { defect: "Autoplays audio with no way to stop it", severity: "Critical" as const, description: "Sound starts automatically and can't be paused or muted, covering screen-reader speech. Fails SC 1.4.2." },
  { defect: "Custom controls that aren't keyboard-operable", severity: "Critical" as const, description: "Hand-built play/scrub controls made from <div>s with no keyboard support or accessible names. Fails SC 2.1.1 and 4.1.2 — prefer native <video controls>." },
  { defect: "Subtitles used in place of captions", severity: "Medium" as const, description: "Only translated subtitles (dialogue) are supplied, omitting the non-speech sounds and speaker IDs that captions must include." },
];

const TEST_STEPS = [
  { action: "Tab to the player and press Space.", expected: "The video plays; Space again pauses it. Every control is reachable and operable by keyboard alone." },
  { action: "Turn captions on (CC menu) and play.", expected: "Synchronized captions appear and include non-speech sounds like “[music]”, not just dialogue." },
  { action: "Reload the page and watch on load.", expected: "The video does not autoplay audio; if anything autoplays it is muted or has an immediate pause/stop control." },
  { action: "Activate “Show transcript”.", expected: "A full text transcript is revealed; the toggle's aria-expanded flips to true and the transcript region is announced." },
  { action: "With a screen reader, focus the player.", expected: "It is announced with a meaningful accessible name plus the video role — not a bare “video”." },
  { action: "Judge whether audio description is needed.", expected: "If important visuals aren't conveyed by the audio, an audio-described version or an equivalent text description exists (SC 1.2.3 / 1.2.5)." },
];

const CHECKLIST = [
  "Video with audio has a synchronized captions <track> (WebVTT), reviewed for accuracy.",
  "Captions include speaker changes and meaningful non-speech sounds, not only dialogue.",
  "A full text transcript is available (and serves as the media alternative when there is no narration).",
  "Important visual information not in the audio has audio description or a text equivalent.",
  "The player does not autoplay audio for more than 3 seconds without a way to pause, stop, or mute.",
  "All controls (play, mute, timeline, captions, fullscreen) are keyboard-operable and labelled.",
  "The player has a meaningful accessible name describing its content.",
  "Native <video controls> is preferred; any custom control fully re-implements name, role, state, and keyboard support.",
  "The player and captions remain usable and unclipped at 200% browser zoom.",
];

const REFERENCES = [
  { label: "W3C WAI — Making Audio and Video Media Accessible", href: meta.apgUrl },
  { label: "MDN — <video> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video" },
  { label: "MDN — <track> element", href: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track" },
  { label: "MDN — WebVTT (caption format)", href: "https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API" },
];

export function VideoPageClient() {
  const { mode } = useMode();
  const criteria = meta.scIds.map(getCriterion).filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{meta.category}</Badge>
          <Badge>Native &lt;video&gt;</Badge>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.name}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.definition}</p>
        <LastVerified date="2026-07-13" />
      </header>

      {mode !== "tester" && (
        <PageSection id="implementation" title="Implementation">
          <div className="space-y-3">
            <VideoPattern />
            {mode === "developer" && (
              <CodeBlock code={CODE} filename="video-pattern.tsx" />
            )}
            <p className="text-sm text-muted-foreground">
              Reach for the native <code className="font-mono">&lt;video controls&gt;</code>{" "}
              element first — its controls are already keyboard- and
              screen-reader-accessible. Add a captions{" "}
              <code className="font-mono">&lt;track&gt;</code>, a text transcript,
              and audio description where the visuals carry meaning the audio
              doesn&apos;t. For testing media in general, see the{" "}
              <Link
                href="/how-to-test/media"
                className="text-accent-text underline underline-offset-2"
              >
                Media testing guide
              </Link>
              .
            </p>
          </div>
        </PageSection>
      )}

      <PageSection id="live-demo" title="Live demo">
        <div className="rounded-2xl border border-border bg-card p-6">
          <VideoPattern />
        </div>
      </PageSection>

      {mode === "developer" ? (
        <>
          <PageSection id="aria" title="Required roles, states & properties">
            <AriaTable rows={ARIA_ROWS} />
          </PageSection>
          <PageSection id="keyboard" title="Keyboard interaction model">
            <KeyboardTable rows={KEYBOARD_ROWS} />
            <p className="text-sm text-muted-foreground">
              Native player shortcuts differ between browsers and platforms — do
              not hard-code them. The conformance requirement (SC 2.1.1) is only
              that every control is reachable and operable by keyboard, which the
              native element guarantees.
            </p>
          </PageSection>
          <PageSection id="focus" title="Focus management rules">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Let the native <code className="font-mono">&lt;video controls&gt;</code> manage focus among its own controls — don&apos;t override it with custom tabindex.</li>
              <li>The transcript disclosure keeps focus on its toggle button; the revealed transcript is a labelled region the user reads at their own pace.</li>
              <li>Captions are rendered by the player over the video for the audio track — they aren&apos;t in the DOM tab order and aren&apos;t read by screen readers, which use the audio itself.</li>
            </ul>
          </PageSection>
        </>
      ) : (
        <>
          <PageSection id="test-procedure" title="Keyboard test procedure">
            <TestProcedure steps={TEST_STEPS} />
          </PageSection>
          <PageSection id="sr-announcements" title="Expected screen reader announcements">
            <SrAnnouncementTable rows={SR_ROWS} />
          </PageSection>
          <PageSection id="defects" title="Common defect patterns">
            <DefectPatterns items={DEFECTS} />
          </PageSection>
          <PageSection id="checklist" title="Test case checklist">
            <TestChecklist componentName={meta.name} items={CHECKLIST} />
          </PageSection>
        </>
      )}

      <PageSection id="wcag" title="WCAG 2.2 success criteria mapping">
        <ScTable scIds={meta.scIds} />
      </PageSection>

      <PageSection id="references" title="References">
        <ul className="space-y-2 text-sm">
          {REFERENCES.map((r) => (
            <li key={r.href}>
              <a
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-accent underline decoration-dotted underline-offset-2"
              >
                {r.label}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
          {criteria.map((c) => (
            <li key={c!.id}>
              <a
                href={c!.understandingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-accent underline decoration-dotted underline-offset-2"
              >
                Understanding {c!.id} {c!.name}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
    </div>
  );
}
