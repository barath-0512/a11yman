# a11yman — Project Handoff

Concise handoff for picking this project up in a new session.

## What this is

**a11yman** — tagline **"Build • Test • Ship Accessible"**. A WCAG 2.2 AA UI-component
reference for **developers and accessibility testers**. Think WAI-ARIA APG + Deque
University, but more practical and test-oriented. Every pattern is **hand-coded** (the
source *is* the teaching material) — no Radix / Headless UI / React Aria.

- **Project root:** `/Users/barath/Documents/Accessibiity Project/a11y-reference`
- The parent folder also contains an unrelated `easyalt` Next.js app (the visual theme
  was borrowed from it) and some Python scripts (`app.py`, `scanner.py`, …). **a11yman is
  the `a11y-reference/` Next.js project** — work there.
- Maker: Barath, an accessibility consultant (see `/about`). The site doubles as a
  lead-gen funnel for his audit/training work.

## Stack

Next.js 14.2 (App Router) · TypeScript · Tailwind CSS 3.4 · React 18 · next-themes ·
lucide-react · **jsPDF + jspdf-autotable** (client-side PDF export for the cheat sheet).
Apple-ish theme (borrowed from easyalt): Inter font, glass sticky header,
`rounded-2xl` cards, blue `--accent`. Light/dark via next-themes (class strategy).

## Run / verify (READ THIS FIRST)

- Dev server: preview tool config name **`a11y-reference`** (defined in the *parent*
  `.claude/launch.json` with `cwd: a11y-reference`), port **3000**. Or `npm run dev`.
- Verify: `npx tsc --noEmit -p .` · `npx next lint` · `npm run build` (33 static routes) ·
  axe-core in the browser (inject via CDN in `preview_eval`; target zero violations,
  both themes).

### ⚠️ THE #1 GOTCHA — "site looks broken"

`npm run build` **deletes and rewrites `.next`**. If a dev server is running against the
old `.next`, its CSS/JS chunks then **404 → the page renders unstyled** ("broken"). This
has bitten us repeatedly. **Fix / prevention:**

```bash
# after ANY production build, restart the dev server clean:
lsof -ti:3000 | xargs kill -9 2>/dev/null
rm -rf .next
# then preview_start "a11y-reference" and hard-reload the tab
```

If the site ever looks unstyled, it's almost always this — the source is fine; just
restart the dev server cleanly. `curl -s localhost:3000/ | grep -o '/_next/static/css/[^"?]*'`
then curl that path; a 404 confirms it.

## Layout & providers

`src/app/layout.tsx`: `ThemeProvider` → `ModeProvider` → `ToastProvider` →
`<div id="app-shell">` (skip link + `{children}` + `<BookmarkPrompt/>`) → `<Onboarding/>`
→ `<GoogleAnalytics/>`.

- **Dev/Tester mode** — `src/components/mode-provider.tsx` (`useMode()`, localStorage key
  `a11y-ref-mode`, aria-live announcement). `ModeToggle` in header.
- **Onboarding** — `src/components/onboarding.tsx`: first-visit modal (no stored mode).
  Blurs page, sets `inert` on `#app-shell`, focus-trapped, Escape/Skip. Asks
  Developer/Tester, then fires a toast.
- **Bookmark prompt** — `src/components/bookmark-prompt.tsx`: non-modal `role="dialog"`
  (aria-modal="false", never steals focus, polite live-region announce) that slides in
  bottom-right after **60s** on the site ("Love a11yman? Bookmark it… Ctrl/⌘+D").
  **Desktop only** — gated on `(min-width:1024px) and (hover:hover) and (pointer:fine)`
  via `isDesktopPointer()`, so phones/touch tablets never see it (the shortcut is
  keyboard-only). Dismiss
  = sessionStorage `a11yman-bookmark-dismissed` (suppresses that session). A global
  Ctrl/⌘+D keydown listener (never `preventDefault`ed — best proxy for "did they
  bookmark") sets localStorage `a11yman-bookmarked` → **never shown again, ever**.
- **Toasts** — `src/components/toast-provider.tsx` (`useToast().show()`): top-right,
  positioned **below the header** (a `ResizeObserver` measures header height),
  `aria-live="polite"`, auto-dismiss. Supports a leading **icon** and **pauses its
  auto-dismiss timer on hover/focus** (resumes for the full remaining time on leave/blur) —
  used by the Developer/Tester mode-switch toast.
- **Header** — `src/components/site-header.tsx`. Flat `NAV` = **Home · Components · ARIA ·
  How to test · About** (the Reference dropdown / `ReferenceMenu` was removed). Desktop
  (≥`xl`): logo + inline nav + ModeToggle + ThemeToggle. Mobile (<`xl`): **hamburger**
  (top-left) holds nav links + ModeToggle; header shows only logo + ThemeToggle. Header uses
  `max-w-screen-2xl` (NOT the shared `.container`, which caps at 1200px and clipped the nav).
- **Logo** — `src/components/app-logo.tsx`: theme-adaptive SVG shield + "A" (AngularJS
  style: accent border/A, background interior, triangle + pentagon counters). Also the
  favicon at `src/app/icon.svg` (fixed blue `#0a6fe0`).

## Data (single sources of truth)

- `src/lib/components-data.ts` — `COMPONENTS[]` (26 items): `{slug, name, definition,
  category, status, apgUrl, nativeElement?, scIds[]}` + `getComponent()`. All
  `status: "complete"`. The home page and every component page read from here. Categories
  now include **Media** (holds the `video` accessible video-player component).
- `src/lib/wcag.ts` — `WCAG_CRITERIA[]` (practical SC subset) + `getCriterion()`.
  `WcagLevel = "A" | "AA" | "AAA"` (AAA added for 2.4.13, 1.4.6, etc.). Includes **2.4.1
  Bypass Blocks** plus media/testing SCs added this cycle (1.2.1–1.2.5, 1.4.2, 2.2.2,
  2.4.2, 2.4.4, 2.4.13 AAA, 3.1.1, 1.4.4, 1.4.10, 1.4.12, 2.5.1). `ScTable`/`getCriterion`
  silently drop SC ids not in this list — add the SC here if a component or testing guide
  references a new one.
- **Testing subsystem data** (all new this cycle):
  - `src/lib/testing-guides.ts` — `TESTING_GUIDES[]` (11 cross-cutting guides:
    color-contrast, images, keyboard-operability, buttons-links, forms, modals-dialogs,
    media, zoom-reflow, timing, language, touch-pointer) with `{slug, title, summary,
    icon, ...sections}`. Powers `/how-to-test` and `/how-to-test/[slug]`.
  - `src/lib/testing-cheatsheet.ts` — `CHEATSHEET[]` (**31 rows**) of
    `{n, test, how, expected, sc: ScRef[]}` + `CHEATSHEET_WORKFLOW` (6 steps) +
    `scToText(sc)`. SC cells link to `/wcag#id`. Use `CHEATSHEET.length` for any
    "N-step" copy (don't hardcode).
  - `src/lib/contrast.ts` — pure WCAG contrast math: `parseHex`, `toHex`,
    `relativeLuminance`, `contrastRatio`, `suggestPassing` (rounding-safe 512-step scan —
    tests the ACTUAL rounded 8-bit colour so the suggestion always passes; returns `null`
    when the target is genuinely unreachable on that background), `evaluate` →
    `{ratio, level, passesAANormal(≥4.5), passesAALarge(≥3), passesAAANormal(≥7),
    passesAAALarge(≥4.5)}`.
- `src/lib/aria.ts` — `ARIA_ATTRIBUTES[]` (~49 states/properties) + `ARIA_ROLES[]` (~68
  concrete roles), both **authored in popularity order** (that order IS the default sort —
  no sort control). Attributes: `{name, type, kind, description}`. Roles:
  `{name, category, description, usedBy[]}` where `usedBy` = component slugs demonstrating
  the role (drives the count badge + "Used by" links). `getAriaAttribute()` /
  `getAriaRole()`. Powers `/aria` and `/aria/[slug]`.
  - **Detail data** (same file): `ATTRIBUTE_DETAILS` / `ROLE_DETAILS` — name-keyed maps
    with the rich per-entry fields the detail page needs (attrs: `longDescription?`,
    `values?`, `usedOn?`, `usedInRoles?`, `inheritsIntoRoles?`, `example?`; roles:
    `longDescription?`, `usedOn?`, `requiredProps?`, `accessibleName?`, `example?`).
    **Every attribute (49) and role (67) has an entry.** `GLOBAL_ARIA_ATTRIBUTES` (22
    globals) + `isGlobalAttribute()`: global attrs render "any element / every role" instead
    of a list; the 27 non-globals each carry the **complete, untruncated** `usedOn` (native
    elements) + role lists. The "Associated roles" section mirrors MDN's split of
    **`usedInRoles`** (roles that directly declare it) vs **`inheritsIntoRoles`** (subclass
    roles that inherit it) — when `inheritsIntoRoles` is present the page shows two labelled
    groups, else one flat list. **Only `aria-expanded` is split so far** (from MDN); the rest
    keep the combined list in `usedInRoles` until split. `derivedValues()` fills
    true/false(/mixed) rows; `valueGuidance()` covers non-enumerated types. NOTE: role-support
    lists are authored from ARIA 1.2 memory — worth an MDN/spec cross-check for precision.
  - **`longDescription` is 2–3 sentences** on every attribute/role detail page (expanded this
    cycle — the `/aria` *index* rows stay one-line). **Deprecated** entries (e.g.
    `aria-grabbed`, `aria-dropeffect`) have their descriptions trimmed and render a red
    "Deprecated" tag on the detail page.
- `src/lib/site.ts` — `SITE_NAME="a11yman"`, `SITE_TAGLINE`, title/description/keywords,
  `APG_VERSION`, `WCAG_VERSION`.

## Component page anatomy

Each component: `src/app/components/<slug>/page.tsx` (server: metadata + a tiny
`<ComponentDetailShell slug="…">{client}</ComponentDetailShell>` wrapper) and
`<slug>-page-client.tsx` (client, `useMode()`). **`ComponentDetailShell`**
(`src/components/reference/component-detail-shell.tsx`) owns the header + a two-column body
(`ComponentSidebar` on the left, page content on the right) + footer — so all 26 detail
pages **and** the dynamic `[slug]` stub share the left-pane component list (alphabetical,
active highlight, "← All components" back link, "Looking for ARIA?" card), mirroring the
ARIA detail `SidebarNav`. The sidebar is `hidden lg:block`. **The `/components` list page
(`components/page.tsx`) renders its own `SiteHeader`/`SiteFooter` — NOT the shell** (it's
the all-components index, no sidebar). Patterns in `src/components/patterns/`; shared UI in
`src/components/reference/` (code-block, sc-table, keyboard-table, aria-table,
sr-announcement-table, defect-patterns, test-checklist, test-procedure,
broken-fixed-toggle, references-list, page-section, last-verified, component-sidebar,
component-detail-shell, **testing-guide-sidebar**, **cheat-sheet-download**).

- **Sidebar active-state (component, ARIA `SidebarNav`, and testing-guide sidebars)** = blue
  text + a blue left-bar indicator: `border-accent bg-accent/10 text-accent-text` with
  `border-l-2 rounded-r-lg` (inactive = transparent left border). Changed this cycle from
  the old accent-ring pill.

Section order: header → **Implementation** → **Live demo** →
mode-dependent sections → **WCAG SC mapping** → **References**.

**Recent structural rules (important):**
- **Native-vs-Custom removed (2026-07-09).** Every component now shows a SINGLE
  implementation in one `<PageSection id="implementation" title="Implementation">` — no
  more `NativeVsCustomTabs`, no "Native HTML" tab, no "Which should I use?" callout. Each
  page keeps the ONE canonical impl its live demo already used: the hand-coded **custom
  ARIA** pattern for widgets; the **native** element only for `button` (real `<button>`
  via `ButtonPattern`), `link-vs-button` (`NativeLinkVsButtonPattern`), and `table`
  (sortable `<table>` via `TablePattern`). The `native-vs-custom-tabs.tsx` component and 22
  now-unused `native-*-pattern.tsx` files were **deleted**; only
  `native-link-vs-button-pattern.tsx` remains (still rendered). `NATIVE_CODE` consts
  survive only in `button` + `link-vs-button` (they ARE those pages' impl code).
- **Tester mode** shows the full `<header>` (category Badge + `<h1>` + definition +
  `LastVerified`) then jumps straight to Live Demo — the header is now rendered
  **unconditionally** in every page-client (no more `{mode === "tester" ? <h1/> : <header/>}`
  ternary). Only the **Implementation** section is tester-hidden, via
  `{mode !== "tester" && (<PageSection id="implementation">…)}`.
- Developer sections: ARIA table, keyboard table, focus rules. Tester sections: test
  procedure, SR announcements (JAWS+Chrome / NVDA+Firefox / VoiceOver+Safari), defect
  patterns (severity + paste-ready text), test checklist.
- **Broken examples removed from live demos.** `BrokenFixedToggle` now renders only
  `fixed` (the `broken` prop is optional/ignored). Broken pattern files still exist but
  aren't shown.
- **`/` is a marketing LANDING page** (`src/app/page.tsx`, added 2026): hero (headline +
  Browse Components / Explore ARIA CTAs + decorative **`HeroIllustration`** SVG — browser
  mockup + a custom `<div role="button">` "Continue" button + a "Focusable" `tabindex="0"`
  callout card, all theme tokens) → 5 feature cards → "Why a11yman?" → stats row (live
  counts; each number a distinct theme hue: `text-accent-text` / `-success-text` /
  `-warning-text` / `-destructive-text`) → search (`GlobalSearchCombobox` — searches
  Components + ARIA attrs/roles + WCAG criteria, routes to `/components/[slug]`,
  `/aria/[name]`, or `/wcag#[id]`; NOT keyboard/SR guide; **background box removed, larger
  heading, uniform spacing**) + quick-link chips → "How it works" → **"How to test" banner**
  (New pill, single "Explore testing guides" CTA) → "Who is a11yman for?" → popular
  components (headings vertically aligned even with a "Most visited" badge). The **"Ready to
  build" CTA banner was removed.** The components-by-category list lives at
  `/components/page.tsx` (dogfooded `SearchCombobox`). Header nav (flat, final) =
  **Home · Components · ARIA · How to test · About** — the old "Reference" dropdown and the
  WCAG/Keyboard/SR nav links were removed (those live under `/how-to-test`'s Essential
  references now). `SiteFooter` = multi-column (Reference / Guides / Project, all real
  internal links incl. "How to test" + "Made with ♥").

**Components (26):** accordion, alert-dialog, breadcrumb, button, carousel, checkbox,
combobox, date-picker, dialog, disclosure, forms, grid, link-vs-button, listbox,
menu-button, navigation, pagination, radio-group, skip-link, slider, switch, table, tabs,
toast, tooltip, **video**. A dynamic `components/[slug]/page.tsx` handles any
`status:"planned"` component (none currently).

- **Media** category holds **video** — an accessible player (`video-pattern.tsx`): native
  `<video>` + `<track kind="captions">` + a transcript disclosure. Added this cycle.

- **Data Display** category holds two now: **table** (static read-only `<table>`) and
  **grid** (interactive `role="grid"` widget — roving tabindex + 2D arrow-key cell nav;
  Implementation-only, no native element, like breadcrumb). They cross-link each other.
  Grid pattern: `src/components/patterns/grid-pattern.tsx`.

**Other pages:** `/wcag` (SC → components reverse lookup), `/aria` (**ARIA reference** —
searchable index of all ARIA attributes + roles; nav link titled "ARIA"),
`/keyboard-reference`, `/screen-reader-guide`, `/about` (leads with a "Why" section, then
the maker — maker eyebrow is now **"IAAP WAS certified"** with a `BadgeCheck` icon), and the
**How-to-test subsystem** (below).

**How-to-test subsystem** (`src/app/how-to-test/`, all new this cycle):
- `page.tsx` — hub: intro + **Testing guides** grid (11 cards from `TESTING_GUIDES`) +
  **Essential references** grid (5 cards: WCAG Index, Keyboard Reference, Testing Cheat
  Sheet, Contrast Analyser, Screen Reader Guide — CTAs bottom-aligned via `mt-auto`) +
  closing note.
- `[slug]/page.tsx` — data-driven guide detail pages with a left **`TestingGuideSidebar`**
  (mirrors the component sidebar). "More testing guides" footer section was removed.
- `cheat-sheet/page.tsx` — the 31-step accessibility testing cheat sheet as an accessible
  `<table>` (SC cells link to `/wcag#id`) + **`CheatSheetDownload`** button → client-side
  landscape-A4 PDF via jsPDF/autotable, tiled "a11yman" watermark (GState opacity 0.06 in
  `didDrawPage`). **jsPDF Helvetica is Latin-1 only** → `pdfSafe()` sanitizes Unicode to
  ASCII (→ ≥ × • — curly quotes) or cells silently drop characters.
- `contrast-analyser/page.tsx` — **Colour Contrast Analyser** (`contrast-analyser.tsx`
  client + `contrast.ts` math). Two `ColourField`s (hex input + native swatch + EyeDropper
  API), live ratio + `LevelBadge`, a `<dl>` results breakdown (Normal / Large / UI
  components each with AA & AAA pass/fail), and **"Closest colours that pass"** —
  AA/AAA toggle, rows shown **only for failing criteria** (`result.ratio < row.target`);
  a green "no changes needed" box when all pass; and when `suggestPassing` returns `null`
  the row reads *"No foreground reaches N:1 on this background — try a lighter or darker
  background."* (genuinely unreachable on mid-tone backgrounds, not a bug). Export + Reset.

- **`/aria`** (`src/app/aria/`): Apple-style index. `page.tsx` (server) = intro + two
  summary cards (jump-links to `#aria-attributes` / `#aria-roles`) + APG footer link;
  `aria-explorer.tsx` (client) = one search box (filters BOTH lists, ⌘K/Ctrl+K focuses it,
  polite live count) → attributes rendered as a **scrollable list of `<Link>` rows**
  styled with grid columns Name/Type/Description (NOT a `<table>` — each row is one nav
  link; stretched-link on `<tr>` was unreliable) → roles as icon cards (icon by role/
  category, count badge = `usedBy.length`). `/aria/[slug]/page.tsx` = dynamic detail
  (attribute OR role, `generateStaticParams` over all names) — **Apple-style two-column
  layout**: left `SidebarNav` (heading + "N in total" + "All attributes/roles" link +
  alphabetical list with active highlight + "New to ARIA?" APG card) and a main `<article>`
  with title + type/category badge + description + a decorative code-chip hero, then
  `Section` rows (icon + label + content). Attr sections: Values / Used on / Associated
  roles / Description / Example. Role sections: Used on / Description / Required properties /
  Accessible name / Used by components / Example. Both end in a References section
  (WAI-ARIA spec + MDN). Example reuses `CodeBlock` and links to the live component demo
  where one exists. All sections render conditionally over `ATTRIBUTE_DETAILS`/`ROLE_DETAILS`
  + fallbacks (see Data section).

## Accessibility rules the site MUST follow (it's the product)

- **Focus indicator is global:** `:focus-visible { outline: 2px solid hsl(var(--ring));
  outline-offset: 2px }` in `globals.css`. We removed **119** `focus-visible:outline-none`
  utilities that were silently killing it. **Do NOT add `focus-visible:outline-none`**
  unless you supply a visible replacement (only the slider thumb legitimately does, via a
  ring).
- **Color tokens:** text colored on a *light-tint* background must use the `-text`
  variants — `text-accent-text`, `text-success-text`, `text-warning-text`,
  `text-destructive-text` (base `--accent`/etc. are for solid fills and fail 4.5:1 as
  tint text). Text *on a solid fill* uses `-foreground` tokens.
- Touch targets ≥ 24×24 (SC 2.5.8); `prefers-reduced-motion` respected; 200% zoom OK.
- Scrollable code blocks are focusable: `<pre tabIndex={0} role="region">` in
  `code-block.tsx`.
- `.eslintrc.json` disables `react/no-unescaped-entities` (raw quotes/apostrophes in JSX
  text are fine).

## Current state

Fully working: 26 components, the **How-to-test subsystem** (hub + 11 guides + 31-step
cheat sheet with watermarked PDF export + Colour Contrast Analyser), Developer/Tester modes,
light/dark, mobile hamburger, first-visit onboarding + toast, rebranded to **a11yman**,
favicon. `tsc` + `next lint` clean.

Header nav is the flat **Home · Components · ARIA · How to test · About**; the About maker
eyebrow reads **"IAAP WAS certified"**. New deps: `jspdf` + `jspdf-autotable`. New route
count grew with `/how-to-test`, `/how-to-test/[slug]` (11), `/how-to-test/cheat-sheet`, and
`/how-to-test/contrast-analyser` — re-run `npm run build` for the exact static-route total.

## Possible next steps (from conversation, not yet done)

- Logo "A" fine-tuning (AngularJS-style shield). User wanted a "professional font /
  superhero" look — current version is a hand-drawn SVG approximation.
- Monetization ideas discussed (not built): consulting/audit lead-gen CTA, gated
  checklist/audit-template downloads (email capture), paid component pack, courses.
- Home hero `<h1>` still reads "WCAG 2.2 AA component reference" (not yet rebranded to
  lead with "a11yman").
