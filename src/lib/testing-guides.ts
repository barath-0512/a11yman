import {
  Contrast,
  Image,
  Keyboard,
  MousePointerClick,
  ClipboardList,
  AppWindow,
  Video,
  ZoomIn,
  Timer,
  Languages,
  Pointer,
  type LucideIcon,
} from "lucide-react";

/**
 * General, page-level accessibility testing guides — the cross-cutting checks
 * that aren't tied to a single component (contrast, images, keyboard flow,
 * forms, etc.). Powers the /how-to-test hub and each /how-to-test/[slug] guide.
 */
export interface WcagRef {
  id: string; // e.g. "1.4.3"
  name: string; // e.g. "Contrast (Minimum)"
  level: "A" | "AA";
}

export interface TestingGuide {
  slug: string;
  title: string;
  /** One-line summary shown on the hub card. */
  summary: string;
  icon: LucideIcon;
  /** Lead paragraph on the guide page. */
  intro: string;
  /** "What to test" — the checklist. */
  whatToTest: string[];
  /** "How to test" — ordered steps, tools first. */
  howToTest: string[];
  /** Optional quick-reference thresholds (used by contrast). */
  thresholds?: { label: string; value: string }[];
  /** Optional "Edge cases" — the tricky details worth calling out. */
  edgeCases?: { title: string; detail: string }[];
  /** "Common failures" to watch for. */
  commonFailures: string[];
  /** Mapped WCAG 2.2 success criteria. */
  criteria: WcagRef[];
}

export const TESTING_GUIDES: TestingGuide[] = [
  {
    slug: "color-contrast",
    title: "Color Contrast",
    summary: "Test text and UI contrast against WCAG 2.2 contrast requirements.",
    icon: Contrast,
    intro:
      "Insufficient contrast is the single most common WCAG failure. Check that text, meaningful icons, and the boundaries of interactive controls stand out enough from their background — in every theme and every interactive state.",
    whatToTest: [
      "Body text and headings meet the minimum ratio for their size.",
      "Muted, helper, and placeholder text that still conveys information.",
      "Meaningful non-text UI: icons, focus rings, form borders, chart lines.",
      "Text set over images or gradients, where the background varies.",
      "Every state — hover, focus, active, selected, disabled, and error.",
    ],
    howToTest: [
      "Run an automated pass (axe DevTools, Lighthouse) to flag obvious text-contrast failures fast.",
      "Sample real foreground/background pairs with a contrast checker — automation can't judge text over images.",
      "Measure non-text UI (icons, borders, focus rings) against their adjacent color; the threshold is 3:1.",
      "Repeat in both light and dark themes, against the actually-rendered background, not the token value.",
    ],
    thresholds: [
      { label: "Normal text", value: "4.5 : 1" },
      { label: "Large text (≥ 24px, or ≥ 18.66px bold)", value: "3 : 1" },
      { label: "Icons & UI component boundaries", value: "3 : 1" },
      { label: "Focus indicator vs adjacent colors", value: "3 : 1" },
    ],
    edgeCases: [
      {
        title: "Focus indicators",
        detail:
          "A focus ring is non-text UI, so it needs 3:1 contrast — and against BOTH the adjacent colors it touches: the component's own background AND the page background it overlaps. A ring that only stands out on one side can still fail (1.4.11). WCAG 2.2 adds 2.4.13 Focus Appearance (AAA) with minimum-area and change-of-contrast rules if you're targeting AAA.",
      },
      {
        title: "Disabled controls are exempt — if truly inactive",
        detail:
          "Disabled elements have no contrast minimum, but only when they're genuinely non-operable. A control that merely looks disabled yet still works must still pass 4.5:1 / 3:1.",
      },
      {
        title: "Text over images, video and gradients",
        detail:
          "Measure the worst-case region of the background, not an average — a caption can pass over the dark part of an image and fail over the light part. Add a scrim, overlay, or text shadow so every pixel behind the text clears the threshold.",
      },
      {
        title: "Every interactive state",
        detail:
          "A color that passes at rest can fail on hover, focus, active, selected, or error. Re-measure each state, in both light and dark themes, against the actually-rendered background rather than the design token.",
      },
      {
        title: "Placeholder and “ghost” text",
        detail:
          "If placeholder text conveys a requirement or instruction it must meet 4.5:1. Even as a pure hint it should stay legible — very light placeholders are a common failure.",
      },
    ],
    commonFailures: [
      "Light-gray placeholder or helper text below 4.5:1.",
      "Focus rings or input borders too faint to meet 1.4.11.",
      "A focus ring that contrasts with the button but not the page behind it.",
      "Accent-colored text placed on a light tint of the same accent.",
      "White text over the light region of a hero image.",
    ],
    criteria: [
      { id: "1.4.3", name: "Contrast (Minimum)", level: "AA" },
      { id: "1.4.11", name: "Non-text Contrast", level: "AA" },
      { id: "1.4.1", name: "Use of Color", level: "A" },
    ],
  },
  {
    slug: "images",
    title: "Images",
    summary: "Ensure images, icons and charts have appropriate text alternatives.",
    icon: Image,
    intro:
      "Every image must expose the right text alternative for its purpose — or be hidden if it is purely decorative. The test is about meaning, not just the presence of an alt attribute.",
    whatToTest: [
      "Informative images have alt text conveying their meaning, not their file name.",
      'Decorative images are hidden from assistive tech (empty alt="" or aria-hidden).',
      "Functional images (icon buttons, logo links) describe the action or destination.",
      "Complex images (charts, diagrams) have an extended description nearby or linked.",
      "Text baked into images is avoided, or duplicated as real text.",
    ],
    howToTest: [
      "Turn images off (or use a text-only view) and confirm the page still makes sense.",
      "Navigate image-by-image in a screen reader (NVDA/JAWS “g”) and listen to each announcement.",
      "Inspect the accessible name in the browser's accessibility tree.",
      "For each image ask: does the alt convey what a sighted user gets — no more, no less?",
    ],
    commonFailures: [
      'alt="image", alt="logo", or the raw filename.',
      "Decorative images given descriptive alt that adds noise.",
      "Icon-only buttons with no accessible name.",
      'Charts with alt="chart" and no underlying data description.',
    ],
    criteria: [
      { id: "1.1.1", name: "Non-text Content", level: "A" },
      { id: "1.4.5", name: "Images of Text", level: "AA" },
    ],
  },
  {
    slug: "keyboard-operability",
    title: "Keyboard Operability",
    summary: "Verify all functionality is available and operable using only a keyboard.",
    icon: Keyboard,
    intro:
      "Put the mouse away. Everything a mouse user can do, a keyboard user must be able to do too — reach it, operate it, and get out of it — with a visible focus indicator the whole way through.",
    whatToTest: [
      "Every interactive element is reachable with Tab / Shift+Tab.",
      "Focus order follows the visual and reading order.",
      "Each control operates with its expected keys (Enter/Space, arrows inside composite widgets).",
      "A visible focus indicator is present on every stop, in both themes.",
      "No keyboard traps — you can always Tab or Escape away.",
      "Focus is never hidden behind sticky headers or overlays.",
    ],
    howToTest: [
      "Tab through the whole page from the top and watch where focus lands.",
      "Operate each widget with the keys its APG pattern specifies (see the Keyboard Reference).",
      "Open menus and dialogs; confirm focus moves in, is contained, and returns on close.",
      "Confirm the focus ring stays visible at every stop.",
    ],
    commonFailures: [
      "Click handlers on <div>/<span> with no keyboard support.",
      "Custom widgets missing arrow-key navigation.",
      "focus-visible:outline-none with no visible replacement.",
      "Focus dropped to <body> after a modal closes.",
    ],
    criteria: [
      { id: "2.1.1", name: "Keyboard", level: "A" },
      { id: "2.1.2", name: "No Keyboard Trap", level: "A" },
      { id: "2.4.3", name: "Focus Order", level: "A" },
      { id: "2.4.7", name: "Focus Visible", level: "AA" },
      { id: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA" },
    ],
  },
  {
    slug: "buttons-links",
    title: "Buttons & Links",
    summary: "Test that buttons and links have an accessible name, purpose and state.",
    icon: MousePointerClick,
    intro:
      "Buttons do things; links go places. Test that each is the right element, carries a clear accessible name, and — for toggles — exposes its current state.",
    whatToTest: [
      "Buttons are <button>; links are <a href>. Actions aren't links; navigation isn't a button.",
      "Every control's accessible name matches or contains its visible label.",
      "Icon-only controls have an accessible name (aria-label or visually-hidden text).",
      "Toggle buttons expose aria-pressed; disclosures expose aria-expanded.",
      "Link text makes sense out of context — no bare “click here” / “read more”.",
      "Targets are at least 24 × 24 CSS pixels.",
    ],
    howToTest: [
      "Tab to each control and listen: name + role should be announced (e.g. “Save, button”).",
      "Confirm the visible label is part of the accessible name (label-in-name).",
      "Activate toggles and confirm the state change is announced.",
      "List all links in a screen reader and check each is self-describing.",
    ],
    commonFailures: [
      "<div onclick> styled to look like a button.",
      "Icon button announced as just “button” with no name.",
      "aria-label that doesn't include the visible text.",
      "Toggle that only changes color, with no aria-pressed.",
    ],
    criteria: [
      { id: "4.1.2", name: "Name, Role, Value", level: "A" },
      { id: "2.4.4", name: "Link Purpose (In Context)", level: "A" },
      { id: "2.5.3", name: "Label in Name", level: "A" },
      { id: "2.5.8", name: "Target Size (Minimum)", level: "AA" },
    ],
  },
  {
    slug: "forms",
    title: "Forms",
    summary: "Validate labels, instructions, error messages and form behaviours.",
    icon: ClipboardList,
    intro:
      "Forms are where accessibility problems cost users the most. Test that every field is labelled, instructions are programmatic, and errors are announced and easy to fix.",
    whatToTest: [
      "Every field has a programmatic label (<label for> or aria-labelledby).",
      "Required fields are indicated in text or ARIA, not by color alone.",
      "Instructions and format hints are associated via aria-describedby.",
      "Errors are identified in text, tied to the field, and say how to fix them.",
      "Inputs collecting personal data use the right autocomplete token.",
      "Submitting with errors announces them (a live region or moved focus).",
    ],
    howToTest: [
      "Tab to each field and confirm its label is announced.",
      "Submit an empty or invalid form; confirm errors are announced and linked to fields.",
      "Verify each error says what's wrong and how to correct it.",
      "Check required and invalid fields expose aria-required / aria-invalid.",
    ],
    commonFailures: [
      "Placeholder used as the only label (it disappears on input).",
      "Errors shown only in red, with no text or programmatic link.",
      "An error summary that neither moves focus nor is announced.",
      "Missing autocomplete on name, email, and address fields.",
    ],
    criteria: [
      { id: "3.3.1", name: "Error Identification", level: "A" },
      { id: "3.3.2", name: "Labels or Instructions", level: "A" },
      { id: "3.3.3", name: "Error Suggestion", level: "AA" },
      { id: "1.3.5", name: "Identify Input Purpose", level: "AA" },
      { id: "4.1.3", name: "Status Messages", level: "AA" },
    ],
  },
  {
    slug: "modals-dialogs",
    title: "Modals & Dialogs",
    summary: "Check focus management, keyboard support and background interaction.",
    icon: AppWindow,
    intro:
      "A modal must take focus, keep it, and give it back — while making everything behind it inert. Most dialog bugs are focus-management bugs.",
    whatToTest: [
      "On open, focus moves into the dialog (the dialog, its heading, or the first control).",
      "Focus is contained while open; Tab cycles within the dialog.",
      "Escape closes the dialog (unless intentionally disabled for an alert dialog).",
      "On close, focus returns to the element that opened it.",
      "Content behind is inert and hidden from assistive tech (aria-modal / inert).",
      "The dialog has role=dialog (or alertdialog) and an accessible name.",
    ],
    howToTest: [
      "Open the dialog with the keyboard and confirm where focus lands.",
      "Tab all the way around; confirm focus never leaves the dialog.",
      "Press Escape; confirm it closes and focus returns to the trigger.",
      "With a screen reader, confirm background content isn't reachable while open.",
    ],
    commonFailures: [
      "Focus stays on the trigger behind the overlay when the dialog opens.",
      "Tab escapes to the page behind the dialog.",
      "Focus dropped to <body> on close instead of returning to the trigger.",
      "Background not inert — the screen reader reads straight through the overlay.",
    ],
    criteria: [
      { id: "2.1.2", name: "No Keyboard Trap", level: "A" },
      { id: "2.4.3", name: "Focus Order", level: "A" },
      { id: "4.1.2", name: "Name, Role, Value", level: "A" },
      { id: "1.3.1", name: "Info and Relationships", level: "A" },
    ],
  },
  {
    slug: "media",
    title: "Media (Audio & Video)",
    summary: "Check captions, transcripts, audio description and player controls.",
    icon: Video,
    intro:
      "Time-based media has to work without sound and without sight. Test that video has synchronized captions, audio has a transcript, and the player itself is operable by keyboard and screen reader.",
    whatToTest: [
      "Prerecorded video with audio has synchronized captions.",
      "Prerecorded audio (podcasts) has a complete text transcript.",
      "Video conveying visual information has audio description or a text alternative.",
      "Captions include speaker changes and meaningful sound effects, not just dialogue.",
      "Media doesn't autoplay with sound — or can be paused/stopped immediately.",
      "Player controls (play, mute, volume, scrubber, captions) are keyboard-operable and labelled.",
    ],
    howToTest: [
      "Watch the video muted and confirm captions convey all spoken and important non-spoken audio.",
      "Listen with the screen off and confirm a transcript exists and is complete.",
      "For instructional video, confirm an audio-description track or equivalent text describes the on-screen action.",
      "Tab through the player and operate every control by keyboard; confirm each has an accessible name.",
    ],
    commonFailures: [
      "Auto-generated captions with errors, no punctuation, or no speaker labels.",
      "Video with missing or out-of-sync captions.",
      "A podcast with no transcript.",
      "A custom player with unlabelled icon controls or no keyboard support.",
      "Autoplaying background media with no pause control.",
    ],
    criteria: [
      { id: "1.2.1", name: "Audio-only and Video-only (Prerecorded)", level: "A" },
      { id: "1.2.2", name: "Captions (Prerecorded)", level: "A" },
      { id: "1.2.3", name: "Audio Description or Media Alternative", level: "A" },
      { id: "1.2.5", name: "Audio Description (Prerecorded)", level: "AA" },
      { id: "1.4.2", name: "Audio Control", level: "A" },
    ],
  },
  {
    slug: "zoom-reflow",
    title: "Zoom & Reflow",
    summary: "Verify content reflows and stays usable at 200% zoom and 320px wide.",
    icon: ZoomIn,
    intro:
      "Low-vision users zoom in — a lot. Test that content reflows to a single column with no horizontal scrolling, nothing is clipped or overlapping, and user text-spacing overrides don't break the layout.",
    whatToTest: [
      "At 200% browser zoom, all text and functionality remains available.",
      "At 320 CSS px wide (≈ 400%), content reflows to one column with no two-dimensional scrolling.",
      "No content is clipped, truncated, or overlapping when enlarged.",
      "Sticky headers/footers don't cover the content or the focused element.",
      "User text-spacing overrides (line/letter/word/paragraph) don't cut text off.",
      "The page works in both portrait and landscape orientation.",
    ],
    howToTest: [
      "Zoom the browser to 200% and confirm nothing is lost or needs horizontal scrolling to read.",
      "Set the viewport to 320px wide (or zoom to 400%) and confirm content reflows to a single column.",
      "Apply a text-spacing bookmarklet and confirm no text is clipped or overlapping.",
      "Rotate between landscape and portrait and confirm layout and functionality hold.",
    ],
    commonFailures: [
      "Fixed-width containers that force horizontal scrolling when zoomed.",
      "Text sized so it doesn't scale, or content that overflows its box.",
      "Two-dimensional scrolling of a region that could reflow.",
      "Content locked to a single orientation.",
      "overflow:hidden clipping text when line-height increases.",
    ],
    criteria: [
      { id: "1.4.4", name: "Resize Text", level: "AA" },
      { id: "1.4.10", name: "Reflow", level: "AA" },
      { id: "1.4.12", name: "Text Spacing", level: "AA" },
      { id: "1.3.4", name: "Orientation", level: "AA" },
    ],
  },
  {
    slug: "timing",
    title: "Timing",
    summary: "Check time limits, moving content and auto-updates can be controlled.",
    icon: Timer,
    intro:
      "Users work at different speeds and some can't rush. Test that time limits can be extended or turned off, and that anything moving, blinking, or auto-updating can be paused.",
    whatToTest: [
      "Time limits can be turned off, adjusted, or extended before they expire.",
      "Session-timeout warnings appear with enough time and a clear way to continue.",
      "Moving/blinking/scrolling content lasting over 5s can be paused, stopped, or hidden.",
      "Auto-updating content (feeds, carousels, tickers) can be paused or controlled.",
      "Nothing flashes more than three times per second.",
      "Re-authenticating after a timeout doesn't lose the user's data.",
    ],
    howToTest: [
      "Find any countdown or session timeout and confirm you can extend or disable it.",
      "Leave an auto-advancing carousel or marquee running and confirm a visible control stops it.",
      "Confirm pausing persists — it must not silently restart.",
      "Review any flashing content against the three-flashes-per-second threshold.",
    ],
    commonFailures: [
      "A session that logs out with no warning and no way to extend.",
      "An auto-rotating carousel with no pause or stop control.",
      "A ticker or animation that runs indefinitely with no control.",
      "Re-login that discards a half-completed form.",
      "Content flashing more than three times a second.",
    ],
    criteria: [
      { id: "2.2.1", name: "Timing Adjustable", level: "A" },
      { id: "2.2.2", name: "Pause, Stop, Hide", level: "A" },
      { id: "2.3.1", name: "Three Flashes or Below Threshold", level: "A" },
    ],
  },
  {
    slug: "language",
    title: "Language",
    summary: "Confirm the page language and any language changes are declared.",
    icon: Languages,
    intro:
      "Screen readers switch pronunciation rules based on the declared language. Test that the page's default language is set and that any passage in another language is marked up.",
    whatToTest: [
      "The <html> element has a valid lang attribute for the page's default language.",
      "The value is a correct BCP-47 code (en, en-GB, fr) — not a full word.",
      "Passages or phrases in a different language carry their own lang attribute.",
      "Proper names and technical terms aren't wrongly marked as a language change.",
      "Embedded iframes and widgets declare their own language.",
    ],
    howToTest: [
      "Inspect the <html> element and confirm a correct lang attribute.",
      "Listen with a screen reader — the voice and pronunciation should match the content's language.",
      "Find foreign-language quotes or terms and confirm each carries a lang attribute.",
      "Validate the language codes are real BCP-47 subtags.",
    ],
    commonFailures: [
      "Missing lang on <html>, so the screen reader uses its default voice.",
      'lang="english" or another invalid value instead of a BCP-47 code.',
      "A multilingual page with no per-passage lang, so foreign text is mispronounced.",
      "The wrong code — e.g. lang=\"en\" on a French page.",
    ],
    criteria: [
      { id: "3.1.1", name: "Language of Page", level: "A" },
      { id: "3.1.2", name: "Language of Parts", level: "AA" },
    ],
  },
  {
    slug: "touch-pointer",
    title: "Touch & Pointer",
    summary: "Test target size, gesture alternatives and pointer cancellation.",
    icon: Pointer,
    intro:
      "Touch and assistive-pointer users need forgiving targets and simple interactions. Test that controls are big enough, complex gestures have single-pointer alternatives, and actions can be cancelled.",
    whatToTest: [
      "Interactive targets are at least 24 × 24 CSS px, or have enough spacing around them.",
      "Multipoint or path-based gestures (swipe, pinch, drag) have a single-pointer alternative.",
      "Drag operations have a non-dragging alternative — buttons, a menu, or inputs.",
      "Actions complete on pointer-up so they can be aborted by moving away first.",
      "Motion-actuated features (shake, tilt) have a UI alternative and can be disabled.",
    ],
    howToTest: [
      "Measure interactive targets; flag anything under 24px without adequate spacing.",
      "Try every gesture-based interaction using only a single tap or click.",
      "For drag-and-drop, confirm a non-drag path exists.",
      "Press down on a control, move off it, and release — it must not activate.",
      "Test any motion-triggered feature with motion disabled and via a normal control.",
    ],
    commonFailures: [
      "Tiny icon buttons or close (×) targets under 24px.",
      "A carousel or slider that only responds to swipe or drag.",
      "A sortable list that can only be reordered by dragging.",
      "Buttons that fire on touchstart/mousedown with no way to abort.",
      "Shake-to-undo with no on-screen equivalent.",
    ],
    criteria: [
      { id: "2.5.1", name: "Pointer Gestures", level: "A" },
      { id: "2.5.2", name: "Pointer Cancellation", level: "A" },
      { id: "2.5.4", name: "Motion Actuation", level: "A" },
      { id: "2.5.7", name: "Dragging Movements", level: "AA" },
      { id: "2.5.8", name: "Target Size (Minimum)", level: "AA" },
    ],
  },
];

export function getTestingGuide(slug: string): TestingGuide | undefined {
  return TESTING_GUIDES.find((g) => g.slug === slug);
}
