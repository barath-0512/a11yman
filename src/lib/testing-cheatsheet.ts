/**
 * A step-by-step accessibility testing cheat sheet — a manual pass you can
 * work top-to-bottom. Rendered as an accessible table on the cheat-sheet page
 * (with each SC linked to /wcag#id) and exported to a watermarked PDF.
 */
export interface ScRef {
  /** WCAG success-criterion number, e.g. "2.4.3". Empty for non-specific rows. */
  id: string;
  /** Short criterion name, shown alongside the id. */
  name?: string;
}

export interface CheatSheetRow {
  n: number;
  test: string;
  how: string;
  expected: string;
  sc: ScRef[];
}

export const CHEATSHEET: CheatSheetRow[] = [
  { n: 1, test: "Page Title", how: "Right-click → Inspect → open <head> → check the <title>.", expected: 'Title accurately describes the page, e.g. "How to Test | a11yman".', sc: [{ id: "2.4.2", name: "Page Titled" }] },
  { n: 2, test: "Page Language", how: "Inspect the <html> element.", expected: 'A lang attribute is present and correct, e.g. lang="en".', sc: [{ id: "3.1.1", name: "Language of Page" }] },
  { n: 3, test: "Image Alt Text", how: "Inspect every <img>, or use an accessibility inspector.", expected: 'Informative images have meaningful alt; decorative images use alt=""; alt is never missing.', sc: [{ id: "1.1.1", name: "Non-text Content" }] },
  { n: 4, test: "Skip Link", how: "Reload the page and press Tab once.", expected: 'A "Skip to main content" link appears and moves focus to the main content.', sc: [{ id: "2.4.1", name: "Bypass Blocks" }] },
  { n: 5, test: "Main Landmark", how: "Inspect the page or use accessibility tools.", expected: "The page has exactly one <main> landmark.", sc: [{ id: "1.3.1", name: "Info & Relationships" }] },
  { n: 6, test: "Headings", how: "Inspect the DOM or use a heading-outline extension.", expected: "One H1 describes the page; heading levels are logical and don't skip.", sc: [{ id: "1.3.1", name: "Info & Relationships" }] },
  { n: 7, test: "Landmark Structure", how: "Check for header, nav, main, footer and aside landmarks.", expected: "Landmarks exist and help users navigate the page.", sc: [{ id: "1.3.1", name: "Info & Relationships" }] },
  { n: 8, test: "Keyboard Navigation", how: "Use only Tab, Shift+Tab, Enter, Space and the arrow keys.", expected: "Every interactive element can be reached and operated by keyboard alone.", sc: [{ id: "2.1.1", name: "Keyboard" }] },
  { n: 9, test: "Keyboard Trap", how: "Move through every interactive component.", expected: "Focus can always move away using standard keys.", sc: [{ id: "2.1.2", name: "No Keyboard Trap" }] },
  { n: 10, test: "Focus Indicator", how: "Tab through the page.", expected: "Focus is always visible, with ≥ 3:1 contrast against adjacent colors.", sc: [{ id: "2.4.7", name: "Focus Visible" }, { id: "2.4.13", name: "Focus Appearance" }] },
  { n: 11, test: "Focus Order", how: "Tab from top to bottom.", expected: "Focus follows the visual and reading order.", sc: [{ id: "2.4.3", name: "Focus Order" }] },
  { n: 12, test: "Link Purpose", how: "Read each link's text without surrounding context.", expected: 'Link text describes its destination; avoid bare "Click here" / "Read more".', sc: [{ id: "2.4.4", name: "Link Purpose" }] },
  { n: 13, test: "Buttons", how: "Inspect button labels or use a screen reader.", expected: "Buttons have accessible names describing their action.", sc: [{ id: "4.1.2", name: "Name, Role, Value" }] },
  { n: 14, test: "Form Labels", how: "Inspect each input field.", expected: "Every control has an associated visible label or accessible name.", sc: [{ id: "1.3.1", name: "Info & Relationships" }, { id: "3.3.2", name: "Labels or Instructions" }] },
  { n: 15, test: "Required Fields", how: "Check required form fields.", expected: "Required state is programmatic, not conveyed by color or an asterisk alone.", sc: [{ id: "3.3.2", name: "Labels or Instructions" }, { id: "1.3.1", name: "Info & Relationships" }] },
  { n: 16, test: "Error Messages", how: "Submit the form with invalid or empty values.", expected: "Errors are descriptive, tied to the field, and announced to assistive tech.", sc: [{ id: "3.3.1", name: "Error Identification" }, { id: "3.3.3", name: "Error Suggestion" }, { id: "4.1.3", name: "Status Messages" }] },
  { n: 17, test: "Color Contrast", how: "Use a contrast checker.", expected: "Normal text ≥ 4.5:1, large text ≥ 3:1, UI & focus indicators ≥ 3:1.", sc: [{ id: "1.4.3", name: "Contrast (Minimum)" }, { id: "1.4.11", name: "Non-text Contrast" }, { id: "2.4.13", name: "Focus Appearance" }] },
  { n: 18, test: "Color Alone", how: "Disable CSS or inspect visual indicators.", expected: "Information is never conveyed by color alone.", sc: [{ id: "1.4.1", name: "Use of Color" }] },
  { n: 19, test: "Zoom", how: "Zoom the browser to 200% and 400%.", expected: "Content stays usable without horizontal scrolling (except where allowed).", sc: [{ id: "1.4.4", name: "Resize Text" }, { id: "1.4.10", name: "Reflow" }] },
  { n: 20, test: "Reflow", how: "Test at 320 CSS px width.", expected: "No loss of content or functionality.", sc: [{ id: "1.4.10", name: "Reflow" }] },
  { n: 21, test: "Text Spacing", how: "Apply the WCAG text-spacing bookmarklet.", expected: "Content stays readable with no clipping or overlap.", sc: [{ id: "1.4.12", name: "Text Spacing" }] },
  { n: 22, test: "Tables", how: "Inspect table markup.", expected: "Data tables use <th>, correct header scope, and a caption where needed.", sc: [{ id: "1.3.1", name: "Info & Relationships" }] },
  { n: 23, test: "Lists", how: "Inspect the HTML.", expected: "Lists use semantic <ul>, <ol> or <dl>.", sc: [{ id: "1.3.1", name: "Info & Relationships" }] },
  { n: 24, test: "Dialogs", how: "Open modal dialogs with the keyboard.", expected: "Focus enters the dialog, is trapped, and returns to the trigger on close.", sc: [{ id: "2.4.3", name: "Focus Order" }, { id: "2.1.1", name: "Keyboard" }, { id: "4.1.2", name: "Name, Role, Value" }] },
  { n: 25, test: "Dynamic Content", how: "Trigger alerts, accordions, tabs and menus.", expected: "Changes are announced via appropriate ARIA roles or live regions.", sc: [{ id: "4.1.2", name: "Name, Role, Value" }, { id: "4.1.3", name: "Status Messages" }] },
  { n: 26, test: "Autoplay & Media", how: "Load the page and trigger any audio or video.", expected: "Nothing autoplays sound for more than 3s without a pause/stop; video has captions and a transcript.", sc: [{ id: "1.4.2", name: "Audio Control" }, { id: "1.2.2", name: "Captions" }, { id: "1.2.3", name: "Media Alternative" }] },
  { n: 27, test: "Target Size", how: "Measure interactive controls — especially icon buttons and close (×) targets.", expected: "Targets are at least 24 × 24 CSS px, or have enough spacing around them.", sc: [{ id: "2.5.8", name: "Target Size (Minimum)" }] },
  { n: 28, test: "Motion & Animation", how: 'Enable "reduce motion" in the OS and check moving content.', expected: "Essential motion respects prefers-reduced-motion; anything moving over 5s can be paused.", sc: [{ id: "2.2.2", name: "Pause, Stop, Hide" }] },
  { n: 29, test: "Pointer & Gestures", how: "Try swipe, pinch and drag interactions using a single tap or click.", expected: "Path-based or multipoint gestures have a single-pointer alternative; dragging has a non-drag path.", sc: [{ id: "2.5.1", name: "Pointer Gestures" }, { id: "2.5.7", name: "Dragging Movements" }] },
  { n: 30, test: "Screen Reader", how: "Test with NVDA, VoiceOver or JAWS.", expected: "Structure, controls, labels and announcements are meaningful and usable.", sc: [{ id: "", name: "Multiple SC" }] },
  { n: 31, test: "Automated Scan", how: "Run axe DevTools or Accessibility Insights.", expected: "Review automated issues and manually verify each finding.", sc: [{ id: "", name: "Multiple SC" }] },
];

/** The recommended order to work through a manual pass. */
export const CHEATSHEET_WORKFLOW = [
  "Scan first — run an automated tool to catch the obvious, low-effort failures.",
  "Check the structure — title, language, landmarks, headings, and alt text.",
  "Put the mouse away — tab through for keyboard operability, focus order, and a visible focus ring.",
  "Look closely — color contrast, use of color, zoom, reflow, and text spacing.",
  "Exercise the interactions — forms and errors, dialogs, media, and dynamic content.",
  "Listen — finish with a screen-reader pass to confirm it all makes sense.",
];

/** Flatten a row's SC refs to a plain string (used by the PDF export). */
export function scToText(sc: ScRef[]): string {
  return sc.map((s) => [s.id, s.name].filter(Boolean).join(" ")).join("; ");
}
