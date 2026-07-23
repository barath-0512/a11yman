export type ComponentStatus = "complete" | "planned";

export interface ComponentMeta {
  slug: string;
  name: string;
  definition: string;
  category: string;
  status: ComponentStatus;
  apgUrl: string;
  nativeElement?: string;
  scIds: string[];
}

export const COMPONENTS: ComponentMeta[] = [
  {
    slug: "accordion",
    name: "Accordion",
    definition:
      "A vertically stacked set of headers that toggle the visibility of associated content panels.",
    category: "Disclosure",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/accordion/",
    nativeElement: "<details>/<summary>",
    scIds: ["1.3.1", "2.1.1", "2.4.6", "2.4.7", "4.1.2"],
  },
  {
    slug: "alert-dialog",
    name: "Alert & Alert Dialog",
    definition:
      "A message interrupting the user with important, often time-sensitive, information requiring acknowledgment.",
    category: "Overlays",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/",
    scIds: ["2.1.1", "2.1.2", "2.4.3", "4.1.2", "4.1.3"],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    definition:
      "A secondary navigation trail showing the user's location within a site hierarchy.",
    category: "Navigation",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/",
    scIds: ["1.3.1", "2.4.3", "2.4.6", "4.1.2"],
  },
  {
    slug: "button",
    name: "Button (incl. toggle button)",
    definition:
      "An interactive control that triggers an action, or toggles between pressed/not-pressed states.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
    nativeElement: "<button>",
    scIds: ["2.1.1", "2.5.3", "2.5.8", "4.1.2"],
  },
  {
    slug: "carousel",
    name: "Carousel",
    definition:
      "A set of rotating slides with controls to move between them and pause automatic rotation.",
    category: "Overlays",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/carousel/",
    scIds: ["2.1.1", "2.2.2", "2.4.3", "4.1.2"],
  },
  {
    slug: "checkbox",
    name: "Checkbox (incl. tri-state)",
    definition:
      "A control allowing a binary or tri-state (checked/unchecked/mixed) choice.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/",
    nativeElement: "<input type=\"checkbox\">",
    scIds: ["1.3.1", "2.1.1", "2.5.8", "3.3.2", "4.1.2"],
  },
  {
    slug: "combobox",
    name: "Combobox",
    definition:
      "A text input combined with a popup listbox that filters/suggests options as the user types.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
    nativeElement: "<datalist>",
    scIds: ["1.3.1", "2.1.1", "2.4.3", "3.3.2", "4.1.2"],
  },
  {
    slug: "dialog",
    name: "Dialog (Modal)",
    definition:
      "A window overlaid on the page, blocking interaction with the rest of the app until dismissed.",
    category: "Overlays",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
    nativeElement: "<dialog>",
    scIds: ["2.1.1", "2.1.2", "2.4.3", "2.4.7", "4.1.2"],
  },
  {
    slug: "disclosure",
    name: "Disclosure (Show/Hide)",
    definition:
      "A single button that shows or hides a section of content, without accordion grouping semantics.",
    category: "Disclosure",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/",
    nativeElement: "<details>/<summary>",
    scIds: ["2.1.1", "4.1.2"],
  },
  {
    slug: "link-vs-button",
    name: "Link vs. Button",
    definition:
      "Guidance on when to use a hyperlink (navigation) versus a button (action) — the most common real-world defect.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/link/",
    scIds: ["1.3.1", "2.1.1", "4.1.2"],
  },
  {
    slug: "listbox",
    name: "Listbox (single & multi-select)",
    definition:
      "A list of options a user can select one or more values from.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
    nativeElement: "<select multiple>",
    scIds: ["1.3.1", "2.1.1", "4.1.2"],
  },
  {
    slug: "menu-button",
    name: "Menu & Menu Button",
    definition:
      "A button that opens a menu of actions or links, navigable with arrow keys.",
    category: "Overlays",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/",
    scIds: ["2.1.1", "2.1.2", "2.4.3", "4.1.2"],
  },
  {
    slug: "navigation",
    name: "Navigation",
    definition:
      "Landmark structure and current-page indication for site navigation.",
    category: "Navigation",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/",
    scIds: ["1.3.1", "2.4.1", "2.4.3", "4.1.2"],
  },
  {
    slug: "skip-link",
    name: "Skip Link",
    definition:
      "A visually-hidden link at the very top of the page that lets keyboard users jump past repeated blocks — like navigation — straight to the main content.",
    category: "Navigation",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
    nativeElement: '<a href="#main">',
    scIds: ["2.4.1", "2.1.1", "2.4.3", "2.4.7"],
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    definition: "A set of mutually exclusive selectable options.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/",
    nativeElement: "<input type=\"radio\">",
    scIds: ["1.3.1", "2.1.1", "4.1.2"],
  },
  {
    slug: "slider",
    name: "Slider",
    definition: "A control for selecting a value from a continuous or discrete range.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/",
    nativeElement: "<input type=\"range\">",
    scIds: ["2.1.1", "2.5.7", "4.1.2"],
  },
  {
    slug: "switch",
    name: "Switch",
    definition: "A two-state on/off toggle control, distinct from a checkbox semantically.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/",
    scIds: ["1.3.1", "2.1.1", "2.5.8", "4.1.2"],
  },
  {
    slug: "table",
    name: "Table",
    definition: "A sortable, read-only data table with proper headers, scope, and caption — static content the user reads, not a widget they operate cell-by-cell.",
    category: "Data Display",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/table/",
    nativeElement: "<table>",
    scIds: ["1.3.1", "2.1.1", "4.1.2", "4.1.3"],
  },
  {
    slug: "grid",
    name: "Grid (interactive data grid)",
    definition:
      "An interactive tabular widget with two-dimensional arrow-key cell navigation (role=\"grid\"). Use only when cells are interactive — read-only data belongs in a Table.",
    category: "Data Display",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
    scIds: ["1.3.1", "2.1.1", "2.4.3", "2.4.7", "4.1.2"],
  },
  {
    slug: "tabs",
    name: "Tabs",
    definition:
      "A set of layered sections of content, one visible at a time, selected via a tab list.",
    category: "Navigation",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/",
    scIds: ["2.1.1", "2.4.3", "3.2.1", "4.1.2"],
  },
  {
    slug: "toast",
    name: "Toast / Status messages",
    definition: "Non-modal, transient messages announced via ARIA live regions.",
    category: "Feedback",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/",
    scIds: ["4.1.3"],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    definition: "A supplementary popup showing extra info on hover or focus.",
    category: "Overlays",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/",
    scIds: ["1.4.13", "2.1.1", "4.1.2"],
  },
  {
    slug: "forms",
    name: "Form patterns",
    definition:
      "Labels, required fields, inline error handling, error summary, aria-describedby, and autocomplete attributes.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/tutorials/forms/",
    scIds: ["1.3.5", "3.3.1", "3.3.2", "3.3.3", "3.3.7", "4.1.2"],
  },
  {
    slug: "pagination",
    name: "Pagination",
    definition: "Controls for navigating through pages of paginated content.",
    category: "Navigation",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/",
    scIds: ["2.1.1", "2.4.6", "4.1.2"],
  },
  {
    slug: "date-picker",
    name: "Date Picker",
    definition: "A dialog-based grid pattern for choosing a date, paired with a text input.",
    category: "Forms & Controls",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
    scIds: ["2.1.1", "2.4.3", "3.3.2", "4.1.2"],
  },
  {
    slug: "video",
    name: "Video Player",
    definition:
      "An accessible media player: native controls, synchronized captions, a text transcript, and audio-description support.",
    category: "Media",
    status: "complete",
    apgUrl: "https://www.w3.org/WAI/media/av/",
    nativeElement: "<video>",
    scIds: ["1.2.1", "1.2.2", "1.2.3", "1.2.5", "1.4.2", "2.1.1", "2.2.2", "4.1.2"],
  },
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}
