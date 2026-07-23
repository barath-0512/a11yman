"use client";

import * as React from "react";
import { FileText, ChevronDown } from "lucide-react";

// CC0 sample clip (ambient music, no dialogue). In production, self-host your
// media rather than hot-linking — this is a demo asset.
const SOURCES = [
  { src: "https://mdn.github.io/shared-assets/videos/flower.mp4", type: "video/mp4" },
  { src: "https://mdn.github.io/shared-assets/videos/flower.webm", type: "video/webm" },
];

export function VideoPattern() {
  const [showTranscript, setShowTranscript] = React.useState(false);
  const transcriptId = "video-demo-transcript";

  return (
    <figure className="m-0 space-y-3">
      <video
        controls
        preload="metadata"
        poster="/media/video-poster.svg"
        aria-label="A flower blooming in timelapse, with gentle ambient music"
        className="aspect-video w-full rounded-xl border border-border bg-black"
      >
        {SOURCES.map((s) => (
          <source key={s.type} src={s.src} type={s.type} />
        ))}
        {/* Synchronized captions, on by default. Same-origin VTT, so no
            crossorigin needed. */}
        <track
          kind="captions"
          src="/media/flower.en.vtt"
          srcLang="en"
          label="English"
          default
        />
        {/* Fallback for browsers without <video> support. */}
        <p className="p-4 text-sm">
          Your browser doesn&apos;t support embedded video. You can{" "}
          <a
            href="https://mdn.github.io/shared-assets/videos/flower.mp4"
            className="text-accent-text underline underline-offset-2"
          >
            download the clip
          </a>{" "}
          instead.
        </p>
      </video>

      <figcaption className="text-sm text-muted-foreground">
        Sample clip (CC0). Captions are on by default — toggle them from the
        player&apos;s CC menu.
      </figcaption>

      {/* Transcript — a hand-coded disclosure. Doubles as the media
          alternative, since this clip has no narration. */}
      <div>
        <button
          type="button"
          aria-expanded={showTranscript}
          aria-controls={transcriptId}
          onClick={() => setShowTranscript((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
        >
          <FileText className="h-4 w-4 text-accent" aria-hidden="true" />
          {showTranscript ? "Hide transcript" : "Show transcript"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showTranscript ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        <div
          id={transcriptId}
          role="region"
          aria-label="Video transcript"
          hidden={!showTranscript}
          className="mt-3 space-y-2 rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed"
        >
          <p className="font-medium text-foreground">Transcript</p>
          <p className="text-muted-foreground">
            [No spoken dialogue.] Gentle ambient music plays throughout. A single
            flower opens in timelapse — the bud swells, the petals unfurl one by
            one, and the bloom turns slowly toward the light before the shot
            fades.
          </p>
          <p className="text-muted-foreground">
            Because the clip has no narration, this transcript also serves as the
            text alternative for its visual content (SC 1.2.3).
          </p>
        </div>
      </div>
    </figure>
  );
}
