// Reference dataset for the ARIA index (/aria) and its detail pages.
//
// Both index arrays are authored in POPULARITY ORDER (most commonly used
// first), which is the default sort the index renders — no sort control needed.
//
// The *_DETAILS maps below carry the full per-entry data the detail pages show.
// Role-support lists are drawn from WAI-ARIA 1.2 ("Used in Roles" /
// "Inherits into Roles"); they are exhaustive (no "…and others" truncation).

export type AriaAttrType =
  | "Boolean"
  | "Tristate"
  | "Token"
  | "Token list"
  | "ID reference"
  | "ID reference list"
  | "Integer"
  | "Number"
  | "String";

export type AriaAttrKind = "state" | "property";

export interface AriaAttribute {
  name: string; // e.g. "aria-checked"
  type: AriaAttrType;
  kind: AriaAttrKind; // state = changes with interaction; property = generally static
  description: string;
  deprecated?: boolean; // removed from / deprecated in the ARIA spec
}

export type AriaRoleCategory =
  | "Widget"
  | "Composite widget"
  | "Landmark"
  | "Live region"
  | "Window"
  | "Document structure";

export interface AriaRole {
  name: string; // e.g. "button"
  category: AriaRoleCategory;
  description: string;
  // Slugs of a11yman components that demonstrate this role (drives the count
  // badge on the index and the "Used by" links on the detail page).
  usedBy: string[];
  deprecated?: boolean; // removed from / deprecated in the ARIA spec
}

export const ARIA_ATTRIBUTES: AriaAttribute[] = [
  { name: "aria-label", type: "String", kind: "property", description: "Defines a string label for an element when no visible text label is present." },
  { name: "aria-labelledby", type: "ID reference list", kind: "property", description: "Names an element using the text of one or more other elements." },
  { name: "aria-hidden", type: "Boolean", kind: "state", description: "Removes an element and its descendants from the accessibility tree." },
  { name: "aria-expanded", type: "Boolean", kind: "state", description: "Indicates whether a collapsible element is currently expanded or collapsed." },
  { name: "aria-current", type: "Token", kind: "state", description: "Marks the current item in a set — page, step, location, date, or time." },
  { name: "aria-describedby", type: "ID reference list", kind: "property", description: "Points to element(s) that provide a longer description of this element." },
  { name: "aria-controls", type: "ID reference list", kind: "property", description: "Identifies the element(s) whose content or presence this element controls." },
  { name: "aria-selected", type: "Boolean", kind: "state", description: "Indicates the selected state of an option, tab, or other selectable item." },
  { name: "aria-checked", type: "Tristate", kind: "state", description: "Indicates the checked state of a checkbox, radio, switch, or menu item." },
  { name: "aria-pressed", type: "Tristate", kind: "state", description: "Indicates the pressed state of a toggle button." },
  { name: "aria-live", type: "Token", kind: "property", description: "Defines how urgently assistive tech announces updates to a live region." },
  { name: "aria-disabled", type: "Boolean", kind: "state", description: "Indicates the element is perceivable but disabled, so not editable or operable." },
  { name: "aria-haspopup", type: "Token", kind: "property", description: "Indicates the element triggers a popup such as a menu, listbox, or dialog." },
  { name: "aria-required", type: "Boolean", kind: "property", description: "Indicates that user input is required on the element before a form is submitted." },
  { name: "aria-invalid", type: "Token", kind: "state", description: "Indicates the entered value does not conform to the expected format." },
  { name: "aria-modal", type: "Boolean", kind: "property", description: "Indicates whether a dialog blocks interaction with the rest of the page." },
  { name: "aria-activedescendant", type: "ID reference", kind: "property", description: "Identifies the currently active descendant of a composite widget." },
  { name: "aria-valuenow", type: "Number", kind: "property", description: "Current value of a range widget such as a slider or progress bar." },
  { name: "aria-valuemin", type: "Number", kind: "property", description: "Minimum allowed value of a range widget." },
  { name: "aria-valuemax", type: "Number", kind: "property", description: "Maximum allowed value of a range widget." },
  { name: "aria-valuetext", type: "String", kind: "property", description: "Readable text alternative for aria-valuenow when the number alone isn't clear." },
  { name: "aria-sort", type: "Token", kind: "property", description: "Indicates whether a table or grid column is sorted, and in which direction." },
  { name: "aria-atomic", type: "Boolean", kind: "property", description: "Whether assistive tech presents all, or only changed, parts of a live region." },
  { name: "aria-busy", type: "Boolean", kind: "state", description: "Indicates an element is being updated and not yet ready to be presented." },
  { name: "aria-relevant", type: "Token list", kind: "property", description: "Which kinds of changes in a live region should be announced." },
  { name: "aria-autocomplete", type: "Token", kind: "property", description: "Describes the kind of autocomplete suggestion an input provides." },
  { name: "aria-orientation", type: "Token", kind: "property", description: "Indicates whether a widget is oriented horizontally or vertically." },
  { name: "aria-level", type: "Integer", kind: "property", description: "Defines the hierarchical level of an element within a structure." },
  { name: "aria-posinset", type: "Integer", kind: "property", description: "The position of an item within the current set of items." },
  { name: "aria-setsize", type: "Integer", kind: "property", description: "The number of items in the current set." },
  { name: "aria-multiselectable", type: "Boolean", kind: "property", description: "Indicates that more than one item in a widget can be selected." },
  { name: "aria-readonly", type: "Boolean", kind: "property", description: "Indicates the element is not editable but is otherwise operable." },
  { name: "aria-multiline", type: "Boolean", kind: "property", description: "Indicates whether a textbox accepts multiple lines of input." },
  { name: "aria-placeholder", type: "String", kind: "property", description: "A short hint shown before the user enters a value in a field." },
  { name: "aria-roledescription", type: "String", kind: "property", description: "A human-readable, author-defined description for an element's role." },
  { name: "aria-keyshortcuts", type: "String", kind: "property", description: "Lists keyboard shortcuts that activate or move focus to the element." },
  { name: "aria-owns", type: "ID reference list", kind: "property", description: "Defines a parent/child relationship the DOM hierarchy can't express." },
  { name: "aria-flowto", type: "ID reference list", kind: "property", description: "Defines an alternate reading order to the next element(s)." },
  { name: "aria-details", type: "ID reference", kind: "property", description: "Points to an element providing extended, structured details." },
  { name: "aria-errormessage", type: "ID reference", kind: "property", description: "Points to the element that describes a validation error for this element." },
  { name: "aria-description", type: "String", kind: "property", description: "Defines a string that describes or annotates the current element." },
  { name: "aria-colcount", type: "Integer", kind: "property", description: "The total number of columns in a table, grid, or treegrid." },
  { name: "aria-colindex", type: "Integer", kind: "property", description: "The column index of an element relative to the total number of columns." },
  { name: "aria-colspan", type: "Integer", kind: "property", description: "The number of columns spanned by a cell or gridcell." },
  { name: "aria-rowcount", type: "Integer", kind: "property", description: "The total number of rows in a table, grid, or treegrid." },
  { name: "aria-rowindex", type: "Integer", kind: "property", description: "The row index of an element relative to the total number of rows." },
  { name: "aria-rowspan", type: "Integer", kind: "property", description: "The number of rows spanned by a cell or gridcell." },
  { name: "aria-grabbed", type: "Boolean", kind: "state", description: "Deprecated. Indicated an element's grabbed state in a drag-and-drop operation.", deprecated: true },
  { name: "aria-dropeffect", type: "Token list", kind: "property", description: "Deprecated. Described what happens when a dragged item is dropped here.", deprecated: true },
];

export const ARIA_ROLES: AriaRole[] = [
  { name: "button", category: "Widget", description: "An interactive control that triggers an action when activated.", usedBy: ["button"] },
  { name: "dialog", category: "Window", description: "A window overlaid on the page, often modal, for a focused task.", usedBy: ["dialog", "date-picker"] },
  { name: "navigation", category: "Landmark", description: "A collection of links for navigating the site or page.", usedBy: ["navigation", "breadcrumb", "pagination"] },
  { name: "tab", category: "Widget", description: "A label in a tablist that controls the display of an associated tabpanel.", usedBy: ["tabs"] },
  { name: "tablist", category: "Composite widget", description: "A set of tabs that each control one panel of content.", usedBy: ["tabs"] },
  { name: "tabpanel", category: "Widget", description: "The content container associated with a tab.", usedBy: ["tabs"] },
  { name: "alert", category: "Live region", description: "An important, time-sensitive message announced without moving focus.", usedBy: ["alert-dialog", "toast"] },
  { name: "alertdialog", category: "Window", description: "A modal dialog conveying an alert that requires acknowledgment.", usedBy: ["alert-dialog"] },
  { name: "menu", category: "Composite widget", description: "A list of choices or actions the user can invoke.", usedBy: ["menu-button"] },
  { name: "menuitem", category: "Widget", description: "An option in a menu or menubar.", usedBy: ["menu-button"] },
  { name: "listbox", category: "Composite widget", description: "A list of options from which the user can select one or more.", usedBy: ["listbox", "combobox"] },
  { name: "option", category: "Widget", description: "A selectable item in a listbox.", usedBy: ["listbox", "combobox"] },
  { name: "combobox", category: "Composite widget", description: "An input paired with a popup that helps the user choose a value.", usedBy: ["combobox", "date-picker"] },
  { name: "checkbox", category: "Widget", description: "A control that can be checked, unchecked, or partially checked.", usedBy: ["checkbox"] },
  { name: "radio", category: "Widget", description: "One selectable option within a radiogroup.", usedBy: ["radio-group"] },
  { name: "radiogroup", category: "Composite widget", description: "A group of mutually exclusive radio options.", usedBy: ["radio-group"] },
  { name: "switch", category: "Widget", description: "A control representing an on/off value, distinct from a checkbox.", usedBy: ["switch"] },
  { name: "slider", category: "Widget", description: "A control for selecting a value from within a range.", usedBy: ["slider"] },
  { name: "tooltip", category: "Widget", description: "Contextual popup text describing the element it is attached to.", usedBy: ["tooltip"] },
  { name: "grid", category: "Composite widget", description: "An interactive tabular container navigated with the arrow keys.", usedBy: ["grid"] },
  { name: "gridcell", category: "Widget", description: "A cell in a grid or treegrid.", usedBy: ["grid"] },
  { name: "row", category: "Document structure", description: "A row of cells within a table, grid, or treegrid.", usedBy: ["grid", "table"] },
  { name: "columnheader", category: "Document structure", description: "A header cell for a column of a table or grid.", usedBy: ["grid", "table"] },
  { name: "rowheader", category: "Document structure", description: "A header cell for a row of a table or grid.", usedBy: ["table"] },
  { name: "status", category: "Live region", description: "An advisory message announced politely, without moving focus.", usedBy: ["toast"] },
  { name: "region", category: "Landmark", description: "A significant section of the page, given a name for navigation.", usedBy: ["carousel"] },
  { name: "form", category: "Landmark", description: "A section containing a collection of form-related controls.", usedBy: ["forms"] },
  { name: "link", category: "Widget", description: "An interactive reference to a resource that navigates when activated.", usedBy: ["link-vs-button"] },
  { name: "heading", category: "Document structure", description: "A heading for a section of the page, with a level.", usedBy: ["accordion"] },
  { name: "list", category: "Document structure", description: "A group of non-interactive list items.", usedBy: ["breadcrumb"] },
  { name: "listitem", category: "Document structure", description: "A single item in a list.", usedBy: ["breadcrumb"] },
  { name: "table", category: "Document structure", description: "Static tabular data arranged in rows and columns.", usedBy: ["table"] },
  { name: "group", category: "Document structure", description: "A set of related elements not intended to be a landmark.", usedBy: ["radio-group"] },
  { name: "textbox", category: "Widget", description: "A region that allows the user to enter free-form text.", usedBy: ["forms", "combobox"] },
  { name: "main", category: "Landmark", description: "The primary content of the document.", usedBy: [] },
  { name: "banner", category: "Landmark", description: "Site-oriented content at the top of the page, typically the header.", usedBy: [] },
  { name: "contentinfo", category: "Landmark", description: "Footer information about the page, such as copyright and links.", usedBy: [] },
  { name: "complementary", category: "Landmark", description: "Supporting content that remains meaningful on its own.", usedBy: [] },
  { name: "search", category: "Landmark", description: "A section containing search functionality for the site.", usedBy: [] },
  { name: "searchbox", category: "Widget", description: "A textbox intended for entering search queries.", usedBy: [] },
  { name: "progressbar", category: "Widget", description: "Displays the progress of a task that takes a long time.", usedBy: [] },
  { name: "spinbutton", category: "Widget", description: "A range input the user increments or decrements between bounds.", usedBy: [] },
  { name: "menubar", category: "Composite widget", description: "A persistent menu, usually horizontal, of commands.", usedBy: [] },
  { name: "menuitemcheckbox", category: "Widget", description: "A checkable menu item with a true/false state.", usedBy: [] },
  { name: "menuitemradio", category: "Widget", description: "A checkable menu item in a set where only one can be checked.", usedBy: [] },
  { name: "toolbar", category: "Document structure", description: "A container for grouping a set of controls, such as buttons.", usedBy: [] },
  { name: "tree", category: "Composite widget", description: "A hierarchical list that can expand and collapse.", usedBy: [] },
  { name: "treeitem", category: "Widget", description: "An item in a tree that may contain child treeitems.", usedBy: [] },
  { name: "treegrid", category: "Composite widget", description: "A grid whose rows can be expanded and collapsed like a tree.", usedBy: [] },
  { name: "log", category: "Live region", description: "A live region where new information is added in meaningful order.", usedBy: [] },
  { name: "marquee", category: "Live region", description: "A live region with non-essential, frequently changing content.", usedBy: [] },
  { name: "timer", category: "Live region", description: "A live region showing elapsed or remaining time.", usedBy: [] },
  { name: "separator", category: "Widget", description: "A divider that may be a focusable value control or static.", usedBy: [] },
  { name: "scrollbar", category: "Widget", description: "A control that scrolls content within a viewport.", usedBy: [] },
  { name: "article", category: "Document structure", description: "A self-contained composition, such as a post or card.", usedBy: [] },
  { name: "note", category: "Document structure", description: "Content parenthetic or ancillary to the main content.", usedBy: [] },
  { name: "figure", category: "Document structure", description: "Content, optionally with a caption, referenced as a single unit.", usedBy: [] },
  { name: "img", category: "Document structure", description: "A container of content that assistive tech treats as a single image.", usedBy: [] },
  { name: "feed", category: "Document structure", description: "A scrollable list of articles that loads more as the user scrolls.", usedBy: [] },
  { name: "document", category: "Document structure", description: "A region of content read in the assistive tech's document mode.", usedBy: [] },
  { name: "application", category: "Document structure", description: "A region the app handles fully, suppressing default AT navigation.", usedBy: [] },
  { name: "cell", category: "Document structure", description: "A cell in a table that is not a header cell.", usedBy: [] },
  { name: "rowgroup", category: "Document structure", description: "A group of rows, such as a thead or tbody, within a table.", usedBy: [] },
  { name: "meter", category: "Widget", description: "A scalar measurement within a known range, like a battery gauge.", usedBy: [] },
  { name: "none", category: "Document structure", description: "Removes an element's implicit semantics (synonym of presentation).", usedBy: [] },
  { name: "presentation", category: "Document structure", description: "Removes an element's implicit semantics from the accessibility tree.", usedBy: [] },
  { name: "generic", category: "Document structure", description: "An element with no meaningful role, like a div or span.", usedBy: [] },
];

export function getAriaAttribute(name: string): AriaAttribute | undefined {
  return ARIA_ATTRIBUTES.find((a) => a.name === name);
}

export function getAriaRole(name: string): AriaRole | undefined {
  return ARIA_ROLES.find((r) => r.name === name);
}

// ---------------------------------------------------------------------------
// Global states & properties (WAI-ARIA 1.2): supported on ALL elements and all
// roles. The detail page states this explicitly instead of listing every role.
// ---------------------------------------------------------------------------

export const GLOBAL_ARIA_ATTRIBUTES = new Set<string>([
  "aria-atomic",
  "aria-busy",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-description",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-live",
  "aria-owns",
  "aria-relevant",
  "aria-roledescription",
]);

export function isGlobalAttribute(name: string): boolean {
  return GLOBAL_ARIA_ATTRIBUTES.has(name);
}

// ---------------------------------------------------------------------------
// Detail-page data.
// ---------------------------------------------------------------------------

export interface AriaValue {
  value: string;
  description: string;
}

export interface AriaAttributeDetail {
  values?: AriaValue[]; // enumerated token values; boolean/tristate derived in UI
  usedOn?: string[]; // native HTML elements the attribute appears on
  usedInRoles?: string[]; // roles that directly declare support ("Used in roles")
  inheritsIntoRoles?: string[]; // subclass roles that inherit it ("Inherits into roles")
  example?: string;
}

export interface RequiredProp {
  name: string;
  note?: string;
}

export interface AriaRoleDetail {
  usedOn?: string;
  requiredProps?: RequiredProp[];
  accessibleName?: string;
  example?: string;
}

export const ATTRIBUTE_DETAILS: Record<string, AriaAttributeDetail> = {
  // ── Global properties (usedOn / associatedRoles handled as "any" in the UI) ──
  "aria-label": {
    example: `<button aria-label="Close dialog">\n  <svg aria-hidden="true">…</svg>\n</button>`,
  },
  "aria-labelledby": {
    example: `<div role="dialog" aria-labelledby="title">\n  <h2 id="title">Delete file?</h2>\n</div>`,
  },
  "aria-hidden": {
    values: [
      { value: "true", description: "The element and its descendants are removed from the accessibility tree." },
      { value: "false (default)", description: "The element is exposed to assistive technologies." },
    ],
    example: `<span aria-hidden="true">★</span>\n<span class="sr-only">Favorite</span>`,
  },
  "aria-current": {
    values: [
      { value: "page", description: "The current page within a set of pages." },
      { value: "step", description: "The current step in a process." },
      { value: "location", description: "The current location within an environment." },
      { value: "date", description: "The current date within a collection." },
      { value: "time", description: "The current time within a set of times." },
      { value: "true", description: "The current item within a set." },
      { value: "false (default)", description: "Not the current item." },
    ],
    example: `<a href="/pricing" aria-current="page">Pricing</a>`,
  },
  "aria-describedby": {
    example: `<input aria-describedby="hint" />\n<p id="hint">Use 8+ characters.</p>`,
  },
  "aria-controls": {
    example: `<button aria-controls="panel" aria-expanded="true">\n  Toggle\n</button>\n<div id="panel">…</div>`,
  },
  "aria-live": {
    values: [
      { value: "off (default)", description: "Updates are not announced." },
      { value: "polite", description: "Updates are announced at the next graceful opportunity." },
      { value: "assertive", description: "Updates are announced immediately, interrupting the user." },
    ],
    example: `<div aria-live="polite">Changes saved.</div>`,
  },
  "aria-disabled": {
    values: [
      { value: "true", description: "The element is disabled — perceivable but not editable or operable." },
      { value: "false (default)", description: "The element is enabled." },
    ],
    example: `<button aria-disabled="true">Submit</button>`,
  },
  "aria-haspopup": {
    values: [
      { value: "false (default)", description: "The element does not trigger a popup." },
      { value: "true", description: "The popup is a menu (same as \"menu\")." },
      { value: "menu", description: "The element opens a menu." },
      { value: "listbox", description: "The element opens a listbox." },
      { value: "tree", description: "The element opens a tree." },
      { value: "grid", description: "The element opens a grid." },
      { value: "dialog", description: "The element opens a dialog." },
    ],
    example: `<button aria-haspopup="menu" aria-expanded="false">\n  Actions\n</button>`,
  },
  "aria-invalid": {
    values: [
      { value: "false (default)", description: "The value is valid." },
      { value: "true", description: "The value has failed validation." },
      { value: "grammar", description: "A grammatical error was detected." },
      { value: "spelling", description: "A spelling error was detected." },
    ],
    example: `<input aria-invalid="true" aria-errormessage="err" />\n<p id="err">Enter a valid email.</p>`,
  },
  "aria-atomic": {
    values: [
      { value: "true", description: "Assistive tech presents the entire live region on any change." },
      { value: "false (default)", description: "Assistive tech presents only the changed nodes." },
    ],
    example: `<div aria-live="polite" aria-atomic="true">Page 3 of 8</div>`,
  },
  "aria-busy": {
    values: [
      { value: "true", description: "The element is being updated; hold announcements until done." },
      { value: "false (default)", description: "There are no expected updates." },
    ],
    example: `<ul aria-busy="true" aria-live="polite">…loading…</ul>`,
  },
  "aria-relevant": {
    values: [
      { value: "additions", description: "Announce nodes added to the live region." },
      { value: "removals", description: "Announce nodes removed from the live region." },
      { value: "text", description: "Announce text changes within the live region." },
      { value: "additions text (default)", description: "Announce additions and text changes." },
      { value: "all", description: "Announce additions, removals, and text changes." },
    ],
    example: `<ul aria-live="polite" aria-relevant="additions">…</ul>`,
  },
  "aria-owns": {
    example: `<div role="menu" aria-owns="submenu">…</div>\n<div id="submenu" role="menu">…</div>`,
  },
  "aria-flowto": {
    example: `<div id="step1" aria-flowto="step3">…</div>`,
  },
  "aria-details": {
    example: `<img aria-details="chart-desc" src="sales.png" />\n<div id="chart-desc">Detailed breakdown…</div>`,
  },
  "aria-errormessage": {
    example: `<input aria-invalid="true" aria-errormessage="err" />\n<p id="err">Enter a valid email.</p>`,
  },
  "aria-description": {
    example: `<button aria-description="Opens in a new tab">Docs</button>`,
  },
  "aria-keyshortcuts": {
    example: `<button aria-keyshortcuts="Control+S">Save</button>`,
  },
  "aria-roledescription": {
    example: `<div role="group" aria-roledescription="slide" aria-label="1 of 4">…</div>`,
  },
  "aria-grabbed": {
    values: [
      { value: "true", description: "The element is grabbed for dragging (deprecated)." },
      { value: "false", description: "The element is draggable but not currently grabbed (deprecated)." },
      { value: "undefined (default)", description: "The element is not draggable." },
    ],
    example: `<li aria-grabbed="true">Item</li>`,
  },
  "aria-dropeffect": {
    values: [
      { value: "none (default)", description: "No operation can be performed on drop." },
      { value: "copy", description: "A duplicate is made on drop." },
      { value: "execute", description: "A function is performed on drop." },
      { value: "link", description: "A reference is created on drop." },
      { value: "move", description: "The source is moved on drop." },
      { value: "popup", description: "A menu of drop options is shown (deprecated)." },
    ],
    example: `<div aria-dropeffect="move">Drop zone</div>`,
  },

  // ── Non-global states & properties (complete usedOn + associatedRoles) ──
  "aria-expanded": {
    values: [
      { value: "true", description: "The element, or the grouping element it controls, is expanded." },
      { value: "false", description: "The element, or the grouping element it controls, is collapsed." },
      { value: "undefined (default)", description: "The element is not expandable." },
    ],
    usedOn: ["<button>", "<a href>", "<summary>", "<input>"],
    usedInRoles: ["application", "button", "checkbox", "combobox", "gridcell", "link", "listbox", "menuitem", "row", "tab", "treeitem"],
    inheritsIntoRoles: ["columnheader", "menuitemcheckbox", "menuitemradio", "rowheader", "switch"],
    example: `<button aria-expanded="false" aria-controls="details1">\n  More details\n</button>\n<div id="details1" hidden>\n  Additional information…\n</div>`,
  },
  "aria-selected": {
    values: [
      { value: "true", description: "The item is selected." },
      { value: "false", description: "The item is selectable but not currently selected." },
      { value: "undefined (default)", description: "The item is not selectable." },
    ],
    usedOn: ["<option>", "<tr>", "<td>", "<th>"],
    usedInRoles: ["columnheader", "gridcell", "option", "row", "rowheader", "tab", "treeitem"],
    example: `<div role="tab" aria-selected="true">Profile</div>`,
  },
  "aria-checked": {
    values: [
      { value: "true", description: "The element is checked." },
      { value: "false", description: "The element is not checked." },
      { value: "mixed", description: "A partially checked (indeterminate) state, for tri-state checkboxes." },
      { value: "undefined (default)", description: "The element does not support being checked." },
    ],
    usedOn: ['<input type="checkbox">', '<input type="radio">'],
    usedInRoles: ["checkbox", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch", "treeitem"],
    example: `<span role="checkbox" aria-checked="mixed" tabindex="0">\n  Select all\n</span>`,
  },
  "aria-pressed": {
    values: [
      { value: "true", description: "The toggle button is pressed." },
      { value: "false", description: "The toggle button is not pressed." },
      { value: "mixed", description: "The button is partially pressed (rarely used)." },
      { value: "undefined (default)", description: "The button is not a toggle button." },
    ],
    usedOn: ["<button>"],
    usedInRoles: ["button"],
    example: `<button aria-pressed="true">Mute</button>`,
  },
  "aria-required": {
    values: [
      { value: "true", description: "User input is required before submission." },
      { value: "false (default)", description: "User input is optional." },
    ],
    usedOn: ["<input>", "<select>", "<textarea>"],
    usedInRoles: ["checkbox", "columnheader", "combobox", "gridcell", "listbox", "radiogroup", "rowheader", "searchbox", "spinbutton", "switch", "textbox", "tree", "treegrid"],
    example: `<input role="spinbutton" aria-required="true" />`,
  },
  "aria-modal": {
    values: [
      { value: "true", description: "Content outside the element is inert while it is displayed." },
      { value: "false (default)", description: "Content outside the element remains interactive." },
    ],
    usedOn: ["<dialog>"],
    usedInRoles: ["alertdialog", "dialog"],
    example: `<div role="dialog" aria-modal="true" aria-label="Settings">…</div>`,
  },
  "aria-activedescendant": {
    usedOn: ["<input>", '<div role="…">'],
    usedInRoles: ["application", "combobox", "grid", "group", "listbox", "menu", "menubar", "radiogroup", "row", "searchbox", "spinbutton", "tablist", "textbox", "toolbar", "tree", "treegrid"],
    example: `<input role="combobox" aria-activedescendant="opt-2"\n  aria-controls="list" />\n<ul id="list" role="listbox">\n  <li id="opt-2" role="option">Banana</li>\n</ul>`,
  },
  "aria-valuenow": {
    usedOn: ['<input type="range">', "<progress>", "<meter>"],
    usedInRoles: ["meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton"],
    example: `<div role="slider" aria-valuenow="60"\n  aria-valuemin="0" aria-valuemax="100">…</div>`,
  },
  "aria-valuemin": {
    usedOn: ['<input type="range">'],
    usedInRoles: ["meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton"],
    example: `<div role="slider" aria-valuemin="0"\n  aria-valuenow="60" aria-valuemax="100">…</div>`,
  },
  "aria-valuemax": {
    usedOn: ['<input type="range">'],
    usedInRoles: ["meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton"],
    example: `<div role="slider" aria-valuemax="100"\n  aria-valuemin="0" aria-valuenow="60">…</div>`,
  },
  "aria-valuetext": {
    usedOn: ['<input type="range">'],
    usedInRoles: ["meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton"],
    example: `<div role="slider" aria-valuenow="2"\n  aria-valuetext="Medium">…</div>`,
  },
  "aria-sort": {
    values: [
      { value: "none (default)", description: "There is no defined sort applied." },
      { value: "ascending", description: "Items are sorted in ascending order." },
      { value: "descending", description: "Items are sorted in descending order." },
      { value: "other", description: "A sort algorithm other than ascending or descending was applied." },
    ],
    usedOn: ["<th>"],
    usedInRoles: ["columnheader", "rowheader"],
    example: `<th aria-sort="ascending">\n  <button>Name</button>\n</th>`,
  },
  "aria-autocomplete": {
    values: [
      { value: "none (default)", description: "No suggestion is offered." },
      { value: "inline", description: "The input is completed inline as the user types." },
      { value: "list", description: "A collection of suggestions is presented in a popup." },
      { value: "both", description: "Both an inline completion and a list of suggestions." },
    ],
    usedOn: ["<input>", "<textarea>"],
    usedInRoles: ["combobox", "searchbox", "textbox"],
    example: `<input role="combobox" aria-autocomplete="list"\n  aria-controls="list" aria-expanded="true" />`,
  },
  "aria-orientation": {
    values: [
      { value: "horizontal", description: "The element is oriented horizontally." },
      { value: "vertical", description: "The element is oriented vertically." },
      { value: "undefined (default)", description: "The orientation is unknown or not applicable." },
    ],
    usedOn: ["<hr>", '<div role="…">'],
    usedInRoles: ["combobox", "grid", "listbox", "menu", "menubar", "radiogroup", "scrollbar", "separator", "slider", "tablist", "toolbar", "tree", "treegrid"],
    example: `<div role="tablist" aria-orientation="vertical">…</div>`,
  },
  "aria-level": {
    usedOn: ["<h1>–<h6>", "<li>"],
    usedInRoles: ["heading", "listitem", "row", "treeitem"],
    example: `<div role="heading" aria-level="2">Section title</div>`,
  },
  "aria-posinset": {
    usedOn: ["<li>", "<option>"],
    usedInRoles: ["article", "listitem", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "tab", "treeitem"],
    example: `<li role="option" aria-posinset="3" aria-setsize="12">…</li>`,
  },
  "aria-setsize": {
    usedOn: ["<li>", "<option>"],
    usedInRoles: ["article", "listitem", "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio", "row", "tab", "treeitem"],
    example: `<li role="option" aria-setsize="12" aria-posinset="3">…</li>`,
  },
  "aria-multiselectable": {
    values: [
      { value: "true", description: "More than one item may be selected at a time." },
      { value: "false (default)", description: "Only one item may be selected at a time." },
    ],
    usedOn: ["<select multiple>", '<div role="listbox">'],
    usedInRoles: ["grid", "listbox", "tablist", "tree", "treegrid"],
    example: `<ul role="listbox" aria-multiselectable="true">…</ul>`,
  },
  "aria-readonly": {
    values: [
      { value: "true", description: "The value is not editable, but the element is otherwise operable." },
      { value: "false (default)", description: "The value is editable." },
    ],
    usedOn: ["<input>", "<textarea>"],
    usedInRoles: ["checkbox", "columnheader", "combobox", "grid", "gridcell", "listbox", "radiogroup", "rowheader", "searchbox", "slider", "spinbutton", "switch", "textbox", "treegrid"],
    example: `<div role="textbox" aria-readonly="true">Fixed value</div>`,
  },
  "aria-multiline": {
    values: [
      { value: "true", description: "The textbox accepts multiple lines of input." },
      { value: "false (default)", description: "The textbox accepts only a single line." },
    ],
    usedOn: ["<textarea>"],
    usedInRoles: ["searchbox", "textbox"],
    example: `<div role="textbox" aria-multiline="true" contenteditable>…</div>`,
  },
  "aria-placeholder": {
    usedOn: ["<input>", "<textarea>"],
    usedInRoles: ["searchbox", "textbox"],
    example: `<div role="textbox" aria-placeholder="you@example.com" contenteditable></div>`,
  },
  "aria-colcount": {
    usedOn: ["<table>"],
    usedInRoles: ["grid", "table", "treegrid"],
    example: `<div role="grid" aria-colcount="12">…</div>`,
  },
  "aria-colindex": {
    usedOn: ["<td>", "<th>", "<tr>"],
    usedInRoles: ["cell", "columnheader", "gridcell", "row", "rowheader"],
    example: `<span role="gridcell" aria-colindex="4">$42.00</span>`,
  },
  "aria-colspan": {
    usedOn: ["<td colspan>", "<th colspan>"],
    usedInRoles: ["cell", "columnheader", "gridcell", "rowheader"],
    example: `<div role="gridcell" aria-colspan="2">Merged</div>`,
  },
  "aria-rowcount": {
    usedOn: ["<table>"],
    usedInRoles: ["grid", "table", "treegrid"],
    example: `<div role="grid" aria-rowcount="500">…</div>`,
  },
  "aria-rowindex": {
    usedOn: ["<tr>", "<td>", "<th>"],
    usedInRoles: ["cell", "columnheader", "gridcell", "row", "rowheader"],
    example: `<div role="row" aria-rowindex="312">…</div>`,
  },
  "aria-rowspan": {
    usedOn: ["<td rowspan>", "<th rowspan>"],
    usedInRoles: ["cell", "columnheader", "gridcell", "rowheader"],
    example: `<div role="gridcell" aria-rowspan="2">Tall cell</div>`,
  },
};

export const ROLE_DETAILS: Record<string, AriaRoleDetail> = {
  button: {
    usedOn: "Any activatable element. Always prefer the native <button>, which provides this role for free.",
    accessibleName: "Required. From visible child text, or aria-label / aria-labelledby for icon-only buttons.",
    example: `<button type="button">Save changes</button>\n\n<!-- toggle button -->\n<button aria-pressed="false">Mute</button>`,
  },
  dialog: {
    usedOn: "A dialog container — commonly a <div>, or the native <dialog> element.",
    requiredProps: [
      { name: 'aria-modal="true"', note: "strongly recommended for modal dialogs" },
      { name: "aria-labelledby or aria-label" },
    ],
    accessibleName: "Required. Provide a name via aria-labelledby (the dialog's heading) or aria-label.",
    example: `<div role="dialog" aria-modal="true"\n  aria-labelledby="dialog-title">\n  <h2 id="dialog-title">Delete file?</h2>\n  <p>This action cannot be undone.</p>\n  <button>Cancel</button>\n  <button>Delete</button>\n</div>`,
  },
  navigation: {
    usedOn: "A container for a set of navigation links. Prefer the native <nav>.",
    accessibleName: "Recommended when there is more than one nav, via aria-labelledby or aria-label.",
    example: `<nav aria-label="Breadcrumb">\n  <ol>…</ol>\n</nav>`,
  },
  tab: {
    usedOn: "A label element inside a tablist.",
    requiredProps: [
      { name: "aria-selected" },
      { name: "aria-controls", note: "points to the tabpanel" },
    ],
    accessibleName: "From the tab's child text content.",
    example: `<div role="tab" aria-selected="true"\n  aria-controls="p1" id="t1">Profile</div>`,
  },
  tablist: {
    usedOn: "The container grouping a set of tabs.",
    requiredProps: [{ name: "aria-orientation", note: "if vertical" }],
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="tablist" aria-label="Account settings">…</div>`,
  },
  tabpanel: {
    usedOn: "The content container associated with a tab.",
    accessibleName: "Recommended, via aria-labelledby pointing to its tab.",
    example: `<div role="tabpanel" aria-labelledby="t1" id="p1">…</div>`,
  },
  alert: {
    usedOn: "A live region container for an important, time-sensitive message.",
    accessibleName: "Not required. The message is announced automatically when it appears.",
    example: `<div role="alert">Your session will expire in 1 minute.</div>`,
  },
  alertdialog: {
    usedOn: "A dialog container conveying an urgent message that requires a response.",
    requiredProps: [
      { name: 'aria-modal="true"' },
      { name: "aria-labelledby or aria-label" },
      { name: "aria-describedby", note: "points to the alert message" },
    ],
    accessibleName: "Required, via aria-labelledby or aria-label. Move focus to the least destructive action on open.",
    example: `<div role="alertdialog" aria-modal="true"\n  aria-labelledby="t" aria-describedby="d">\n  <h2 id="t">Delete 12 items?</h2>\n  <p id="d">This can't be undone.</p>\n</div>`,
  },
  menu: {
    usedOn: "A container for a set of menu items, usually opened from a menu button.",
    accessibleName: "Recommended, via aria-labelledby (the button) or aria-label.",
    example: `<ul role="menu">\n  <li role="menuitem">Rename</li>\n</ul>`,
  },
  menuitem: {
    usedOn: "An option within a menu or menubar.",
    accessibleName: "From the item's child text content.",
    example: `<li role="menuitem" tabindex="-1">Duplicate</li>`,
  },
  listbox: {
    usedOn: "A container presenting a list of selectable options.",
    requiredProps: [{ name: "aria-multiselectable", note: "if more than one option may be selected" }],
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<ul role="listbox" aria-label="Colors">\n  <li role="option" aria-selected="true">Red</li>\n</ul>`,
  },
  option: {
    usedOn: "A selectable item within a listbox.",
    requiredProps: [{ name: "aria-selected", note: "true or false" }],
    accessibleName: "From the option's child text content.",
    example: `<li role="option" aria-selected="true">TypeScript</li>`,
  },
  combobox: {
    usedOn: "An input that controls a popup (listbox, grid, tree, or dialog) of values.",
    requiredProps: [
      { name: "aria-expanded" },
      { name: "aria-controls", note: "points to the popup" },
    ],
    accessibleName: "Required, via a visible label + aria-labelledby, or aria-label.",
    example: `<input role="combobox" aria-expanded="true"\n  aria-controls="list" aria-autocomplete="list" />`,
  },
  checkbox: {
    usedOn: 'A checkable control. Prefer <input type="checkbox"> unless you need a tri-state parent.',
    requiredProps: [{ name: "aria-checked", note: "true, false, or mixed" }],
    accessibleName: "Required, via a visible label + aria-labelledby, or aria-label.",
    example: `<span role="checkbox" aria-checked="false" tabindex="0">\n  Subscribe\n</span>`,
  },
  radio: {
    usedOn: "One option inside a radiogroup.",
    requiredProps: [{ name: "aria-checked", note: "true or false" }],
    accessibleName: "Required, from child text or aria-label.",
    example: `<span role="radio" aria-checked="true">Fast</span>`,
  },
  radiogroup: {
    usedOn: "A container grouping mutually exclusive radios.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="radiogroup" aria-label="Speed">…</div>`,
  },
  switch: {
    usedOn: "A button-like control representing an on/off value.",
    requiredProps: [{ name: "aria-checked", note: "true or false — switches have no mixed state" }],
    accessibleName: "Required, via a visible label + aria-labelledby, or aria-label.",
    example: `<button role="switch" aria-checked="true"\n  aria-labelledby="wifi-label">…</button>`,
  },
  slider: {
    usedOn: 'A control for choosing a value from a range. Prefer <input type="range">.',
    requiredProps: [
      { name: "aria-valuenow" },
      { name: "aria-valuemin" },
      { name: "aria-valuemax" },
    ],
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="slider" tabindex="0"\n  aria-valuenow="60" aria-valuemin="0"\n  aria-valuemax="100" aria-label="Volume">…</div>`,
  },
  tooltip: {
    usedOn: "A popup describing the element it is attached to.",
    requiredProps: [{ name: "aria-describedby", note: "on the trigger, pointing to the tooltip" }],
    accessibleName: "From the tooltip's child text content.",
    example: `<button aria-describedby="tip">?</button>\n<div role="tooltip" id="tip">Reset to defaults</div>`,
  },
  grid: {
    usedOn: "An interactive tabular container navigated with the arrow keys.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="grid" aria-label="Transactions" aria-colcount="4">…</div>`,
  },
  gridcell: {
    usedOn: "A cell within a grid or treegrid row.",
    accessibleName: "From child content, or aria-label / aria-labelledby.",
    example: `<span role="gridcell">$42.00</span>`,
  },
  row: {
    usedOn: "A row of cells within a table, grid, or treegrid.",
    accessibleName: "From child cell content.",
    example: `<div role="row"><span role="gridcell">…</span></div>`,
  },
  columnheader: {
    usedOn: "A header cell for a column. Prefer <th scope=\"col\">.",
    accessibleName: "From child content, or aria-label / aria-labelledby.",
    example: `<th scope="col" role="columnheader" aria-sort="ascending">Name</th>`,
  },
  rowheader: {
    usedOn: 'A header cell for a row. Prefer <th scope="row">.',
    accessibleName: "From child content, or aria-label / aria-labelledby.",
    example: `<th scope="row" role="rowheader">Amara Okafor</th>`,
  },
  status: {
    usedOn: "A live region container for advisory, non-urgent information.",
    accessibleName: "Not required. Content is announced politely when it changes.",
    example: `<div role="status">Changes saved successfully.</div>`,
  },
  region: {
    usedOn: "A significant section of content. Prefer <section>.",
    requiredProps: [{ name: "aria-labelledby or aria-label", note: "a region MUST be named" }],
    accessibleName: "Required — an unnamed region is not exposed as a landmark.",
    example: `<section aria-labelledby="h">\n  <h2 id="h">Featured</h2>\n</section>`,
  },
  form: {
    usedOn: "A collection of form-related controls. Prefer <form>.",
    accessibleName: "Recommended, via aria-labelledby or aria-label, to expose it as a landmark.",
    example: `<form aria-label="Contact us">…</form>`,
  },
  link: {
    usedOn: "A reference that navigates when activated. Prefer <a href>.",
    accessibleName: "Required. From child text, or aria-label / aria-labelledby.",
    example: `<a href="/pricing">View pricing</a>`,
  },
  heading: {
    usedOn: "A section heading. Prefer native <h1>–<h6>.",
    requiredProps: [{ name: "aria-level", note: "the heading level, 1–6+" }],
    accessibleName: "From the heading's child text content.",
    example: `<div role="heading" aria-level="2">Section title</div>`,
  },
  list: {
    usedOn: "A group of list items. Prefer <ul> or <ol>.",
    accessibleName: "Not required; may be named via aria-labelledby or aria-label.",
    example: `<ul role="list">\n  <li role="listitem">One</li>\n</ul>`,
  },
  listitem: {
    usedOn: "A single item in a list. Prefer <li>.",
    accessibleName: "From child content.",
    example: `<li role="listitem">Products</li>`,
  },
  table: {
    usedOn: "Static tabular data. Prefer the native <table>.",
    accessibleName: "Recommended, via a <caption>, aria-labelledby, or aria-label.",
    example: `<table>\n  <caption>Team members</caption>\n  …\n</table>`,
  },
  group: {
    usedOn: "A set of related UI elements not meant to be a landmark.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="group" aria-label="Zoom controls">…</div>`,
  },
  textbox: {
    usedOn: "A free-text input. Prefer <input type=\"text\"> or <textarea>.",
    accessibleName: "Required, via a visible label + aria-labelledby, or aria-label.",
    example: `<div role="textbox" contenteditable aria-label="Note"></div>`,
  },
  main: {
    usedOn: "The primary content of the document. Prefer <main>.",
    accessibleName: "Optional; use aria-labelledby or aria-label only if there are multiple.",
    example: `<main>…</main>`,
  },
  banner: {
    usedOn: "Site-oriented header content. Prefer <header> at the top level.",
    accessibleName: "Optional; name via aria-label if there is more than one.",
    example: `<header>…</header>`,
  },
  contentinfo: {
    usedOn: "Footer information about the page. Prefer <footer> at the top level.",
    accessibleName: "Optional; name via aria-label if there is more than one.",
    example: `<footer>…</footer>`,
  },
  complementary: {
    usedOn: "Supporting content. Prefer <aside>.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<aside aria-label="Related links">…</aside>`,
  },
  search: {
    usedOn: "A section containing search functionality. Prefer <search>.",
    accessibleName: "Recommended, via aria-label if there is more than one.",
    example: `<search>\n  <input type="search" aria-label="Search" />\n</search>`,
  },
  searchbox: {
    usedOn: 'A textbox for search queries. Prefer <input type="search">.',
    accessibleName: "Required, via a visible label + aria-labelledby, or aria-label.",
    example: `<input type="search" role="searchbox" aria-label="Search" />`,
  },
  progressbar: {
    usedOn: "Shows progress of a lengthy task. Prefer <progress>.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="progressbar" aria-valuenow="70"\n  aria-valuemin="0" aria-valuemax="100" aria-label="Upload">…</div>`,
  },
  spinbutton: {
    usedOn: 'A number input with increment/decrement. Prefer <input type="number">.',
    requiredProps: [{ name: "aria-valuenow" }],
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="spinbutton" aria-valuenow="3"\n  aria-valuemin="1" aria-valuemax="9" tabindex="0">…</div>`,
  },
  menubar: {
    usedOn: "A persistent, usually horizontal, bar of menu commands.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="menubar" aria-label="Main">…</div>`,
  },
  menuitemcheckbox: {
    usedOn: "A checkable item within a menu.",
    requiredProps: [{ name: "aria-checked", note: "true, false, or mixed" }],
    accessibleName: "From the item's child text content.",
    example: `<li role="menuitemcheckbox" aria-checked="true">Word wrap</li>`,
  },
  menuitemradio: {
    usedOn: "A checkable item in a set within a menu where only one is checked.",
    requiredProps: [{ name: "aria-checked", note: "true or false" }],
    accessibleName: "From the item's child text content.",
    example: `<li role="menuitemradio" aria-checked="true">Left</li>`,
  },
  toolbar: {
    usedOn: "A container grouping a set of controls, such as buttons.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="toolbar" aria-label="Formatting">…</div>`,
  },
  tree: {
    usedOn: "A hierarchical list that can expand and collapse.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<ul role="tree" aria-label="Files">…</ul>`,
  },
  treeitem: {
    usedOn: "An item in a tree that may contain child treeitems.",
    accessibleName: "From child text content.",
    example: `<li role="treeitem" aria-expanded="false">src</li>`,
  },
  treegrid: {
    usedOn: "A grid whose rows can be expanded and collapsed like a tree.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="treegrid" aria-label="Threads">…</div>`,
  },
  log: {
    usedOn: "A live region where new entries are added in meaningful order.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="log" aria-label="Chat">…</div>`,
  },
  marquee: {
    usedOn: "A live region with non-essential, frequently changing content.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="marquee" aria-label="Stock ticker">…</div>`,
  },
  timer: {
    usedOn: "A live region showing elapsed or remaining time.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="timer" aria-label="Time left">01:59</div>`,
  },
  separator: {
    usedOn: "A divider between content. Prefer <hr> when it is not focusable.",
    requiredProps: [{ name: "aria-valuenow", note: "only when the separator is a focusable value control" }],
    accessibleName: "Recommended when focusable, via aria-label.",
    example: `<div role="separator" tabindex="0" aria-valuenow="50"\n  aria-valuemin="0" aria-valuemax="100"></div>`,
  },
  scrollbar: {
    usedOn: "A graphical control that scrolls content within a viewport.",
    requiredProps: [
      { name: "aria-controls", note: "the scrolled region" },
      { name: "aria-valuenow" },
    ],
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="scrollbar" aria-controls="content"\n  aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>`,
  },
  article: {
    usedOn: "A self-contained composition. Prefer <article>.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<article aria-labelledby="post-title">…</article>`,
  },
  note: {
    usedOn: "Content parenthetic or ancillary to the main content.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="note">Tip: save early and often.</div>`,
  },
  figure: {
    usedOn: "Content, optionally with a caption, referenced as a unit. Prefer <figure>.",
    accessibleName: "From a <figcaption>, aria-labelledby, or aria-label.",
    example: `<figure>\n  <img src="chart.png" alt="Sales chart" />\n  <figcaption>Q4 sales</figcaption>\n</figure>`,
  },
  img: {
    usedOn: "A container treated as a single image. Prefer <img>.",
    accessibleName: "Required, via alt, aria-labelledby, or aria-label.",
    example: `<div role="img" aria-label="4 out of 5 stars">★★★★☆</div>`,
  },
  feed: {
    usedOn: "A scrollable list of articles that loads more on scroll.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="feed" aria-label="Posts">\n  <article aria-posinset="1" aria-setsize="-1">…</article>\n</div>`,
  },
  document: {
    usedOn: "A region read in the assistive tech's document (reading) mode.",
    accessibleName: "Recommended, via aria-labelledby or aria-label.",
    example: `<div role="document" aria-label="Terms">…</div>`,
  },
  application: {
    usedOn: "A region the app controls fully, suppressing default AT reading keys.",
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="application" aria-label="Spreadsheet">…</div>`,
  },
  cell: {
    usedOn: 'A non-header table cell. Prefer <td>.',
    accessibleName: "From child content.",
    example: `<td role="cell">Active</td>`,
  },
  rowgroup: {
    usedOn: "A group of rows. Prefer <thead>, <tbody>, or <tfoot>.",
    accessibleName: "Not applicable.",
    example: `<tbody role="rowgroup">…</tbody>`,
  },
  meter: {
    usedOn: "A scalar measurement within a known range. Prefer <meter>.",
    requiredProps: [{ name: "aria-valuenow" }],
    accessibleName: "Required, via aria-labelledby or aria-label.",
    example: `<div role="meter" aria-valuenow="80"\n  aria-valuemin="0" aria-valuemax="100" aria-label="Battery">…</div>`,
  },
  none: {
    usedOn: "Any element whose implicit semantics should be removed (synonym of presentation).",
    accessibleName: "Not applicable — naming is prohibited.",
    example: `<ul role="none">\n  <li role="none"><a role="menuitem" href="/">Home</a></li>\n</ul>`,
  },
  presentation: {
    usedOn: "Any element whose implicit semantics should be removed.",
    accessibleName: "Not applicable — naming is prohibited.",
    example: `<table role="presentation">…layout only…</table>`,
  },
  generic: {
    usedOn: "An element with no meaningful role, like <div> or <span>.",
    accessibleName: "Not applicable — naming is prohibited.",
    example: `<div><!-- generic container --></div>`,
  },
};

/**
 * Fuller, 2–3 sentence explanations shown as the subtitle on each ARIA detail
 * page (`/aria/[slug]`). The short one-liners in ARIA_ATTRIBUTES / ARIA_ROLES
 * stay terse for the searchable index; these add the context a detail page
 * warrants — what the feature does, how it behaves, and when to reach for it.
 * Keyed by attribute or role name; every entry in both lists has one.
 */
export const ARIA_LONG_DESCRIPTIONS: Record<string, string> = {
  // ── Attributes ──
  "aria-label": "Provides an invisible text label for an element that has no visible text, such as an icon-only button. Screen readers announce this string as the element's accessible name. Prefer a visible label referenced with aria-labelledby where you can, since aria-label text never appears on screen.",
  "aria-labelledby": "Gives an element an accessible name by pointing to the IDs of one or more other elements whose visible text should be used. When several IDs are listed, their text is joined in the order given. It takes precedence over aria-label and native labelling, so it's ideal for reusing text already on the page.",
  "aria-hidden": "Removes an element and all of its descendants from the accessibility tree, so assistive technologies skip it entirely while it stays visible on screen. Use it to hide decorative graphics or text that would otherwise be announced twice. Never put it on a focusable element, or keyboard users will land on something screen readers can't describe.",
  "aria-expanded": "Indicates whether the collapsible content a control shows or hides is currently expanded or collapsed. Place it on the control that does the toggling — the button or header — not on the region being toggled. Keep it in sync with the actual visibility every time the state changes so screen readers announce 'expanded' or 'collapsed' correctly.",
  "aria-current": "Marks the single item in a set that represents the user's current location — the current page in a nav, step in a process, or date in a calendar. It takes a token (page, step, location, date, time) or true, and only one element in the set should carry it. Screen readers announce it as 'current page' and similar, helping users orient themselves.",
  "aria-describedby": "Associates an element with other elements whose text provides a longer description, such as a field's hint or error message. The referenced text is announced after the element's name and role, as supplementary detail. Unlike aria-labelledby it supplements the accessible name rather than replacing it.",
  "aria-controls": "Identifies the element(s) whose content or presence the current element controls, such as the panel a tab or toggle button opens. It expresses the relationship programmatically but has uneven screen-reader support, so don't rely on it as the only cue. It's commonly paired with aria-expanded in disclosure and tab patterns.",
  "aria-selected": "Indicates the selection state of an item in a widget that supports selection, such as an option, tab, or gridcell. In a single-select widget exactly one item is selected, and it should track the user's choice as they navigate. It differs from focus — the focused (active) item and the selected item may or may not be the same, depending on the interaction model.",
  "aria-checked": "Communicates the checked state of a checkbox, radio button, switch, or checkable menu item. It is tri-state — true, false, or mixed — where 'mixed' represents a partially checked parent checkbox. Native form controls expose this automatically; you set it by hand only on custom widgets built from generic elements.",
  "aria-pressed": "Indicates whether a toggle button is currently pressed (on) or not (off), turning a plain button into a two-state control. Values are true, false, or mixed for a partially pressed state. Use it only on buttons whose pressed state persists; for a control that turns a setting on or off, role='switch' is often clearer.",
  "aria-live": "Turns a container into a live region so assistive technologies announce changes to its content without the user moving focus there. 'polite' waits for a natural pause, 'assertive' interrupts immediately, and 'off' disables announcements. Set it on the container before the content changes, since regions added and populated in the same moment are often missed.",
  "aria-disabled": "Indicates an element is disabled — visible and discoverable, but not editable or operable. Unlike the native `disabled` attribute it keeps the element in the tab order and the accessibility tree, so screen-reader users can still find and read it. You must also block the element's action in script, because aria-disabled alone doesn't prevent interaction.",
  "aria-haspopup": "Indicates that activating the element reveals a popup — a menu, listbox, tree, grid, or dialog — and names which kind. Screen readers announce that a popup is available so users know to expect it. It describes the type of popup, not whether it is currently open; use aria-expanded for the open/closed state.",
  "aria-required": "Indicates that the user must provide a value for a field before the form can be submitted. Screen readers announce the field as 'required' so the expectation is clear up front. On native controls prefer the `required` attribute, which also triggers browser validation; use aria-required for custom widgets.",
  "aria-invalid": "Indicates that the value the user entered fails validation or doesn't match the expected format. Values include true, false, grammar, and spelling, and it's usually toggled after the user submits or leaves the field. Pair it with aria-errormessage or aria-describedby so screen-reader users hear what went wrong and how to fix it.",
  "aria-modal": "Tells assistive technologies that a dialog is modal — everything outside it is inert while it's open, so screen readers should confine navigation to the dialog. It replaces the older approach of applying aria-hidden to all the background content. You still have to trap keyboard focus and handle Escape yourself; aria-modal only affects the reading experience.",
  "aria-activedescendant": "Lets a single container keep DOM focus while pointing to the ID of the item that is virtually active within it, such as the highlighted option in a combobox popup. It's an alternative to roving tabindex for composite widgets, avoiding actually moving focus between children. The referenced element must be a valid descendant and should stay visible as the active item changes.",
  "aria-valuenow": "Holds the current numeric value of a range widget such as a slider, spinbutton, or progress bar. Screen readers announce it, often as a percentage between aria-valuemin and aria-valuemax. When the raw number isn't meaningful on its own, add aria-valuetext to supply readable text instead.",
  "aria-valuemin": "Defines the minimum value a range widget can take, forming the lower bound for aria-valuenow. Assistive technologies use it together with aria-valuemax to express the current value as a proportion of the range. It's required on slider and spinbutton unless the range has no defined minimum.",
  "aria-valuemax": "Defines the maximum value a range widget can take, forming the upper bound for aria-valuenow. Together with aria-valuemin it lets assistive technologies announce the current value as a percentage of the range. It's required on slider and spinbutton unless the range is open-ended.",
  "aria-valuetext": "Provides a human-readable alternative to aria-valuenow for cases where the raw number would confuse — for example a slider whose values map to sizes ('Medium') or to days of the week. When set, screen readers announce this text in place of the number. Update it whenever aria-valuenow changes.",
  "aria-sort": "Indicates whether a table or grid column is currently sorted and in which direction — ascending, descending, other, or none. Put it on the header cell of the sorted column, and mark only one column at a time. Screen readers announce the sort state so users understand how the data is ordered.",
  "aria-atomic": "Controls how much of a live region assistive technologies present when it changes: 'true' re-announces the whole region, 'false' (the default) announces only the nodes that changed. Set it to true when the changed value only makes sense in full context, like 'Page 3 of 8'. It works alongside aria-live and aria-relevant to shape announcements.",
  "aria-busy": "Indicates that an element is being updated and may not yet be in a stable, complete state. Setting it to true tells assistive technologies to hold announcements until you set it back to false, avoiding a flurry of partial updates while content loads. It's useful on live regions and containers during asynchronous loading.",
  "aria-relevant": "Specifies which kinds of changes within a live region are worth announcing — additions, removals, text, or all. The default, 'additions text', announces added nodes and text changes but not removals. It's an optional refinement of aria-live that screen readers honor inconsistently, so rely on it lightly.",
  "aria-autocomplete": "Describes what kind of autocomplete an input offers: 'inline' completes the text in place, 'list' shows suggestions in a popup, 'both' does both, and 'none' offers none. It's set on the textbox of a combobox so screen readers can tell users that suggestions exist. It describes the prediction model, not whether suggestions are showing right now.",
  "aria-orientation": "Indicates whether a widget such as a slider, toolbar, tablist, or menu is laid out horizontally or vertically. It tells assistive technologies which arrow keys move within the widget and hints at the expected keyboard behavior. Many roles have a sensible default orientation, so set it only when yours differs.",
  "aria-level": "Defines the hierarchical level of an element within a structure — a heading rank, or the depth of an item in a tree or nested list. It's a positive integer starting at 1 for the top level. Use it on custom headings or tree items where native elements don't already convey the nesting.",
  "aria-posinset": "Gives an item's position within its set — item 3 of a list, say — when the full set isn't all present in the DOM, as with a virtualized or paged list. It's paired with aria-setsize so screen readers can announce '3 of 20'. You only need it when the DOM doesn't already reflect the true positions.",
  "aria-setsize": "Declares the total number of items in a set even when only some are in the DOM, as with lazy-loaded or virtualized lists. Combined with aria-posinset it lets screen readers announce an item's place, like '3 of 100'. A value of -1 indicates the total size is unknown.",
  "aria-multiselectable": "Indicates that a widget such as a listbox, grid, or tree allows more than one item to be selected at once. Screen readers announce that multiple selection is possible, and each selectable child tracks its own aria-selected. Omit it or set false for single-select widgets.",
  "aria-readonly": "Indicates that the user can view and navigate an element's value but not change it — unlike aria-disabled, which also blocks operation. The element still receives focus and participates normally, so it's read-only rather than inert. It applies to inputs, grids, and other editable widgets.",
  "aria-multiline": "Indicates whether a textbox accepts a single line or multiple lines of text. It affects how Enter behaves — inserting a newline in a multiline box versus submitting in a single-line one — and how screen readers describe the field. A native `<textarea>` implies this automatically; set it on custom text widgets.",
  "aria-placeholder": "Supplies a short hint describing the expected value of an input, shown before the user types anything. It mirrors the native `placeholder` attribute for custom textbox widgets built from non-input elements. Placeholder text is not a substitute for a real label, which the field still needs.",
  "aria-roledescription": "Lets you supply a human-readable, author-defined name for an element's role — for example calling a carousel group a 'slide'. Screen readers announce this in place of the default role name, so use it sparingly and only where the interaction genuinely matches. Never use it to rename a role in a way that misleads about how the element behaves.",
  "aria-keyshortcuts": "Lists the keyboard shortcuts you've implemented to activate an element or move focus to it, such as 'Control+S'. It only advertises the shortcuts to assistive technologies; you still have to wire up the actual key handling yourself. Keep them discoverable and avoid clashing with browser and screen-reader keys.",
  "aria-owns": "Establishes a parent/child relationship the DOM structure can't express, making assistive technologies treat the referenced elements as children of this one. It helps when related content must live elsewhere in the DOM, like a popup rendered at the end of the body. Use it as a last resort — it can be fragile and it reorders the accessibility tree.",
  "aria-flowto": "Overrides the default reading order by pointing assistive technologies to the element(s) that should be read next. It defines an alternate path through content when the DOM order doesn't match the intended sequence. Support is limited and it can disorient users, so prefer fixing the DOM order where you can.",
  "aria-details": "Points to the ID of an element that provides extended, structured detail about the current element — for instance a full description of a chart or image. Unlike aria-describedby, the referenced content can be rich (lists, tables, links) and users navigate to it rather than hearing it read inline. Reach for it when a simple text description isn't enough.",
  "aria-errormessage": "Points to the element containing the error message for a field that has failed validation. It's only meaningful when the element is also marked aria-invalid='true'; otherwise assistive technologies ignore it. The referenced message should be visible and explain how to correct the problem.",
  "aria-description": "Supplies a plain-text description of an element directly, as an alternative to aria-describedby when the text doesn't already exist on the page. Screen readers announce it as supplementary detail after the name and role. Support is still emerging, so back it up with a more established technique where the description is essential.",
  "aria-colcount": "Declares the total number of columns in a table, grid, or treegrid when not all of them are present in the DOM, as with horizontally virtualized data. It's set on the table element and paired with aria-colindex on cells. A value of -1 means the total column count is unknown.",
  "aria-colindex": "Gives a cell or row its column position within the full table when the DOM doesn't contain every column, such as a virtualized grid. The 1-based index refers to the position in the complete data set, not just the rendered columns. It's used together with aria-colcount.",
  "aria-colspan": "Indicates how many columns a cell spans in a grid or treegrid, mirroring the native `colspan` attribute for ARIA-based tables. It helps assistive technologies convey the cell's extent across columns. You only need it on custom grids built without native table elements, which already expose spanning.",
  "aria-rowcount": "Declares the total number of rows in a table, grid, or treegrid when the DOM holds only a subset, as with vertically virtualized data. It's set on the table element and paired with aria-rowindex on rows. A value of -1 indicates the total is unknown.",
  "aria-rowindex": "Gives a row (or cell) its position within the full set of rows when not all rows are rendered, such as an infinite-scrolling grid. The 1-based index refers to the complete data set, so screen readers can announce 'row 250 of 1000'. It's used together with aria-rowcount.",
  "aria-rowspan": "Indicates how many rows a cell spans in a grid or treegrid, mirroring the native `rowspan` attribute for ARIA-based tables. It tells assistive technologies the cell's vertical extent. It's only required on custom grids that don't use native table markup.",
  "aria-grabbed": "Indicated whether an element was currently 'grabbed' in a drag-and-drop operation. Part of an ARIA drag-and-drop model that never gained reliable support and was removed from the spec — use native HTML drag-and-drop or an accessible custom pattern instead.",
  "aria-dropeffect": "Described what would happen — copy, move, link, or execute — when a dragged item was dropped on the element. Part of the same unsupported drag-and-drop model as aria-grabbed — prefer modern accessible drag-and-drop with clear instructions and status messages.",

  // ── Roles ──
  button: "Identifies an interactive control that performs an action — submitting, toggling, opening a dialog — when activated. It must respond to both Enter and Space and sit in the tab order. Always prefer the native `<button>` element, which provides all of this for free; use role='button' only when you truly can't.",
  dialog: "Marks a container as a dialog — a window overlaid on the page for a focused task or message. It needs an accessible name via aria-labelledby or aria-label and, when modal, aria-modal plus focus management. Use the native `<dialog>` element where possible for built-in behavior.",
  navigation: "Identifies a major block of navigation links, exposing it as a landmark users can jump to. Give each navigation region a distinct label when a page has more than one, such as 'Primary' and 'Breadcrumb'. The native `<nav>` element conveys this role automatically.",
  tab: "A control within a tablist that displays its associated tabpanel when activated. It uses aria-selected to show which tab is active and aria-controls to point at its panel. Only the selected tab is in the tab order; arrow keys move between tabs per the APG pattern.",
  tablist: "A container holding a set of tabs, each of which reveals one panel of content. It manages a single-selection model and typically uses roving tabindex with arrow-key navigation between its tabs. Pair it with tab and tabpanel to build the full tabs pattern.",
  tabpanel: "The content region associated with a tab, shown when that tab is selected and hidden otherwise. It should be labelled by its tab with aria-labelledby and is often focusable so keyboard users can move into the revealed content. Only the active panel is visible at a time.",
  alert: "A live region for an important, time-sensitive message — such as a validation error — announced immediately without moving focus. It's implicitly assertive and atomic, so screen readers interrupt to read it. Insert the element or its text after load so the change is detected; don't put role='alert' on content that's always present.",
  alertdialog: "A modal dialog that conveys an alert requiring the user's acknowledgment or response, like a confirmation before deleting. On open, focus moves into it and it's announced like an alert. Give it aria-labelledby for the title and aria-describedby for the message.",
  menu: "A list of choices or commands the user can invoke, such as an application or context menu — not site navigation. Its items use roles like menuitem, menuitemcheckbox, and menuitemradio, and it's navigated with the arrow keys per the APG menu pattern. It's usually opened from a menu button and closed on selection or Escape.",
  menuitem: "An individual command within a menu or menubar that performs an action when activated. It's reached with the arrow keys rather than Tab, and typically closes the menu when chosen. For options that hold a state, use menuitemcheckbox or menuitemradio instead.",
  listbox: "A widget presenting a list of options from which the user can select one or, with aria-multiselectable, several. Selection is tracked with aria-selected on each option, and it's navigated with the arrow keys. It underlies select-style and combobox popups; prefer a native `<select>` for simple cases.",
  option: "A selectable item within a listbox, carrying its selection state via aria-selected. Options are navigated with the arrow keys, and the active one is indicated by focus or aria-activedescendant. Each should have an accessible name from its text content.",
  combobox: "An input combined with a popup — a listbox, grid, tree, or dialog — that helps the user choose or filter a value. The input uses aria-expanded, aria-controls, and often aria-activedescendant to coordinate with the popup. It backs autocomplete and select-like widgets following the APG combobox pattern.",
  checkbox: "A control with a checked, unchecked, or mixed (indeterminate) state that the user toggles. Its state is exposed through aria-checked, and it responds to Space. Prefer a native `<input type='checkbox'>`; use the role only for custom checkable widgets.",
  radio: "One option within a radiogroup, where selecting it deselects the others in the group. Its selected state is exposed via aria-checked, and arrow keys move selection between radios. Prefer a native `<input type='radio'>` where possible.",
  radiogroup: "A container for a set of mutually exclusive radio options, of which only one can be selected. It manages arrow-key navigation and a single checked child, and should have an accessible name describing the choice. It maps to a native `<fieldset>` of radio inputs.",
  switch: "A control representing an on/off value, like a light switch, with its state exposed through aria-checked as true or false. It's similar to a checkbox but conveys an immediate on/off toggle rather than a selection to be submitted later. It responds to Space and Enter and should carry a clear on/off label.",
  slider: "A control for choosing a value from a range by dragging or using the arrow keys. It exposes aria-valuenow, aria-valuemin, and aria-valuemax, plus aria-valuetext when the number needs a readable form. Prefer a native `<input type='range'>` unless you need custom behavior.",
  tooltip: "A small popup showing brief descriptive text for the element it's attached to, appearing on hover or focus. It supplements rather than replaces an accessible name and shouldn't contain interactive content. Associate it with its trigger via aria-describedby, and make it dismissible with Escape.",
  grid: "An interactive container of tabular data navigated as a two-dimensional widget with the arrow keys. Unlike a static table its cells can be focused and often edited, using roving tabindex or aria-activedescendant. Use it for spreadsheet-like or composite widgets, not for presenting read-only data.",
  gridcell: "A single cell within a grid or treegrid, which can be focusable and, if editable, expose states like aria-readonly or aria-selected. It's the interactive counterpart of a static table cell. Cells are reached with arrow-key navigation rather than Tab.",
  row: "A row of cells within a table, grid, or treegrid, grouping the cells that belong together horizontally. In grids it can be selectable, and in treegrids it can be expandable. It maps to the native `<tr>` element.",
  columnheader: "A header cell that labels a column of a table or grid, exposing the column's meaning to assistive technologies. It can also carry aria-sort to indicate the column's sort state. It maps to a native `<th scope='col'>`.",
  rowheader: "A header cell that labels a row of a table or grid, giving the row a name assistive technologies announce alongside its cells. It helps users keep track of which row they're reading in a wide table. It maps to a native `<th scope='row'>`.",
  status: "A live region for advisory information — like 'Changes saved' — announced politely without interrupting or moving focus. It's implicitly polite and atomic, making it suitable for status messages and non-urgent feedback. The native equivalent is an element already on the page whose text you update.",
  region: "A landmark identifying a significant, self-contained section of the page that users may want to navigate to directly. It only becomes a landmark once given an accessible name via aria-label or aria-labelledby. The native `<section>` element takes on this role when it has a label.",
  form: "A landmark identifying a section that contains a group of form controls submitted together. Like region, it's only exposed as a landmark when it has an accessible name. A native `<form>` element conveys this role when labelled.",
  link: "An interactive reference that navigates to another resource or location when activated. It responds to Enter (not Space) and should make its destination clear. Always prefer a native `<a href>`; role='link' on other elements means adding keyboard and navigation behavior yourself.",
  heading: "Identifies a heading that introduces a section of content, with its rank set by aria-level from 1 to 6. Headings form the document outline screen-reader users rely on to skim and navigate. Prefer native `<h1>`–`<h6>` elements, which set the level implicitly.",
  list: "A container grouping a set of related, non-interactive items so assistive technologies announce the list and its item count. Its allowed children are listitems and grouping rows. Prefer a native `<ul>` or `<ol>`.",
  listitem: "A single item within a list, counted and announced as part of it ('2 of 5'). It must sit within a list role to be meaningful. It maps to the native `<li>` element.",
  table: "Static tabular data arranged in rows and columns for reading, not interaction. Its structure is conveyed through row, columnheader, rowheader, and cell descendants. Prefer a native `<table>`; for an interactive tabular widget use grid instead.",
  group: "A set of related interface elements treated as a unit but not significant enough to be a landmark. It's used to associate controls — like the radios in a radiogroup or a cluster of related fields — and can carry an accessible name. Assistive technologies may announce entering and leaving the group.",
  textbox: "A region where the user can enter and edit free-form text, single- or multi-line (see aria-multiline). It supports states like aria-required, aria-readonly, and aria-invalid. Prefer a native `<input type='text'>` or `<textarea>`; use the role only for custom editable widgets.",
  main: "A landmark identifying the primary content of the page — what's unique to this document, excluding repeated headers, navigation, and footers. There should be only one per page, letting screen-reader users jump straight to the content. The native `<main>` element conveys this role.",
  banner: "A landmark for page-level introductory content at the top, typically the site header with logo and primary navigation. There's usually one per page, and it's for site-oriented rather than page-specific content. A top-level `<header>` element maps to this role.",
  contentinfo: "A landmark for footer information about the page or site, such as copyright, related links, and legal notices. Like banner, there's normally one per page. A top-level `<footer>` element conveys this role.",
  complementary: "A landmark for supporting content that complements the main content but remains meaningful on its own, such as a sidebar of related links. It's a top-level section a user could reasonably navigate to separately. The native `<aside>` element maps to this role.",
  search: "A landmark identifying a section that contains search functionality for the site or page. It lets screen-reader users jump straight to the search form. Apply it to the container (or use `<search>`), not to the individual input, which stays a searchbox or textbox.",
  searchbox: "A textbox specifically intended for entering search queries, distinguishing search input from ordinary text fields. It supports the same editing states as textbox and often sits inside the search landmark. A native `<input type='search'>` conveys this role.",
  progressbar: "Displays the completion progress of a task that takes time, such as a file upload. It exposes aria-valuenow between aria-valuemin and aria-valuemax, or omits valuenow to indicate indeterminate progress. Screen readers announce the percentage complete.",
  spinbutton: "A range input the user increments or decrements — usually with arrow keys or small stepper buttons — between defined bounds. It exposes aria-valuenow, aria-valuemin, and aria-valuemax like a slider but is entered as a discrete number. Prefer `<input type='number'>` for simple cases.",
  menubar: "A persistent, usually horizontal menu of commands, like the menu bar of a desktop application. It contains menuitems and submenus and is navigated with the arrow keys per the APG pattern. Unlike a popup menu it stays visible rather than opening from a button.",
  menuitemcheckbox: "A menu item that holds a checkable true/false state, toggled in place without necessarily closing the menu. Its state is exposed through aria-checked, including 'mixed'. Use it for menu options that switch a setting on or off.",
  menuitemradio: "A menu item within a group where selecting it checks it and unchecks its siblings, like choosing one option from several. Its state is exposed via aria-checked. Group related menuitemradios so assistive technologies convey the single-choice relationship.",
  toolbar: "A container grouping a related set of controls — buttons, toggles, menu buttons — into a single tab stop. Arrow keys move between the controls inside it, cutting down the number of Tab stops. Give it an accessible name describing the group of actions.",
  tree: "A hierarchical list whose items can be expanded and collapsed to reveal or hide nested children, like a file explorer. It's navigated with the arrow keys, using aria-expanded on parent items and aria-level for depth. Follow the APG tree pattern for keyboard behavior.",
  treeitem: "An item within a tree that may contain child treeitems and can be expanded or collapsed via aria-expanded. Its depth is conveyed with aria-level, and it may be selectable with aria-selected. It's reached with arrow-key navigation within the tree.",
  treegrid: "A grid whose rows can be expanded and collapsed like a tree, combining tabular structure with hierarchy. Cells are navigated in two dimensions with the arrow keys, and parent rows use aria-expanded. Use it for hierarchical data that also has columns.",
  log: "A live region where new entries are added over time in a meaningful order, such as a chat transcript or activity log. It's announced politely, and screen readers understand that older content remains for context. Append new messages so the order is preserved.",
  marquee: "A live region containing non-essential, frequently changing content, such as a stock ticker or rotating promo. Because the updates aren't important, assistive technologies announce them minimally or not at all. Use it for ambient content users don't need read aloud.",
  timer: "A live region that presents a numerical count of elapsed or remaining time, updating as time passes. Screen readers avoid announcing every tick, treating it like a marquee for changing values. Use it for countdowns and stopwatches.",
  separator: "A divider between sections of content or menu items. When static it's purely presentational, but as a focusable value control — like a resizable split-pane handle — it becomes interactive and exposes aria-valuenow within a range. The native `<hr>` maps to the static form.",
  scrollbar: "A control that lets the user scroll content within a viewport, exposing its position through aria-valuenow between aria-valuemin and aria-valuemax, plus aria-controls to the scrolled region. It's rarely needed since browsers provide native scrollbars. Use it only for fully custom scrolling widgets.",
  article: "A self-contained composition that could stand alone or be syndicated, such as a blog post, comment, or card. Nesting articles implies the inner ones relate to the outer. The native `<article>` element conveys this role.",
  note: "Content that is parenthetic or ancillary to the main content, such as an aside remark or tip. It signals to assistive technologies that the content is supplementary rather than part of the primary flow. Use it for genuinely tangential notes.",
  figure: "A unit of content — an image, diagram, code sample, or similar — optionally with a caption, referenced as a single item. It groups the content and its caption so they're announced together. The native `<figure>`/`<figcaption>` pair conveys this.",
  img: "A container of one or more elements that assistive technologies should treat as a single image with one accessible name. It's useful when an image is actually built from text, emoji, or several graphics. Give it a name via aria-label or aria-labelledby, and hide its inner parts.",
  feed: "A scrollable list of articles that loads more content as the user scrolls, like an infinite social feed. It defines a keyboard and focus model so screen-reader users can move article by article and know when content is loading. Set aria-busy while new articles are being added.",
  document: "Marks a region of static, readable content where assistive technologies should use their document (browse) reading mode rather than treating it as an application. It's the counterpart to role='application' and restores normal reading-mode keys. It's rarely needed, since browse mode is the default.",
  application: "Tells assistive technologies that the enclosed region is a full application that handles its own keyboard interaction, suppressing the screen reader's default reading-mode navigation. It's powerful and risky — inside it, standard reading keys stop working — so use it only for genuinely app-like widgets and scope it as narrowly as possible.",
  cell: "A cell in a table that holds data and is not a header. It's the ARIA equivalent of a native `<td>` and is announced along with any associated row and column headers. It's used within table and row structures.",
  rowgroup: "Groups a set of rows within a table or grid, such as a header, body, or footer section. It mirrors the native `<thead>`, `<tbody>`, and `<tfoot>` elements. It's a structural grouping rather than an interactive one.",
  meter: "Represents a scalar measurement within a known range, like a battery level, disk usage, or rating — a gauge rather than task progress. It exposes aria-valuenow between aria-valuemin and aria-valuemax. Use progressbar instead for the progress of an ongoing task.",
  none: "Removes an element's implicit semantics so assistive technologies ignore its role while still exposing its contents — the modern synonym of role='presentation'. Use it to strip default roles, for example on a `<table>` used purely for layout. Focusable elements and those carrying ARIA attributes can't have their semantics fully removed this way.",
  presentation: "Removes an element's implicit role from the accessibility tree while keeping its children accessible, so the element becomes a passive wrapper. It's the original name for the behavior now also spelled role='none'. Typical uses are layout tables and list markup you want stripped of list semantics.",
  generic: "A role for an element that has no meaningful semantics of its own, such as a `<div>` or `<span>`. Assistive technologies expose its content but announce no role for the element itself. You rarely set it explicitly; it describes what these container elements already are.",
};

export function getAriaLongDescription(name: string): string | undefined {
  return ARIA_LONG_DESCRIPTIONS[name];
}

export function getAriaAttributeDetail(name: string): AriaAttributeDetail | undefined {
  return ATTRIBUTE_DETAILS[name];
}

export function getAriaRoleDetail(name: string): AriaRoleDetail | undefined {
  return ROLE_DETAILS[name];
}

/** Derives true/false(/mixed) value rows for boolean & tristate attributes that
 *  don't have an explicit `values` list authored. */
export function derivedValues(a: AriaAttribute): AriaValue[] | undefined {
  if (a.type === "Boolean") {
    return [
      { value: "true", description: "The condition the attribute describes is present." },
      { value: "false", description: "The condition the attribute describes is absent." },
    ];
  }
  if (a.type === "Tristate") {
    return [
      { value: "true", description: "The state is on / checked." },
      { value: "false", description: "The state is off / unchecked." },
      { value: "mixed", description: "A partial or indeterminate state." },
    ];
  }
  return undefined;
}
