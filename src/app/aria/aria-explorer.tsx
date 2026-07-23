"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  // category fallbacks
  Pointer,
  LayoutList,
  Compass,
  LayoutTemplate,
  // per-role icons
  RectangleHorizontal,
  AppWindow,
  OctagonAlert,
  TriangleAlert,
  Navigation,
  Frame,
  ClipboardList,
  PanelsTopLeft,
  PanelTop,
  PanelBottom,
  PanelRight,
  TextSearch,
  Table,
  Table2,
  Grid3x3,
  Grid2x2,
  SquareMousePointer,
  Rows2,
  Rows3,
  Rows4,
  Columns3,
  List,
  Dot,
  ListChecks,
  Check,
  SquareChevronDown,
  SquareMenu,
  Menu,
  MousePointerClick,
  SquareCheckBig,
  CircleDotDashed,
  MessageSquare,
  Info,
  ScrollText,
  Megaphone,
  Timer,
  ToggleRight,
  SquareCheck,
  CircleDot,
  Boxes,
  Group,
  SlidersHorizontal,
  ChevronsUpDown,
  LoaderCircle,
  Gauge,
  Link2,
  Heading,
  TextCursorInput,
  ListTree,
  FolderTree,
  SeparatorHorizontal,
  MoveVertical,
  Newspaper,
  StickyNote,
  Images,
  Image,
  Rss,
  FileText,
  MonitorPlay,
  Wrench,
  EyeOff,
  SquareDashed,
  SquareStack,
  type LucideIcon,
} from "lucide-react";
import {
  ARIA_ATTRIBUTES,
  ARIA_ROLES,
  type AriaRole,
  type AriaRoleCategory,
} from "@/lib/aria";

const CATEGORY_ICON: Record<AriaRoleCategory, LucideIcon> = {
  Widget: Pointer,
  "Composite widget": LayoutList,
  Landmark: Compass,
  "Live region": Megaphone,
  Window: AppWindow,
  "Document structure": LayoutTemplate,
};

// A distinct icon per role so the roles grid reads clearly. The only
// intentional repeats are tightly-related families: the tab trio
// (tab / tablist / tabpanel) and the role="none" / role="presentation"
// synonyms.
const ROLE_ICON: Record<string, LucideIcon> = {
  // Window
  dialog: AppWindow,
  alertdialog: OctagonAlert,
  // Landmarks
  navigation: Navigation,
  region: Frame,
  form: ClipboardList,
  main: PanelsTopLeft,
  banner: PanelTop,
  contentinfo: PanelBottom,
  complementary: PanelRight,
  search: Search,
  // Live regions
  alert: TriangleAlert,
  status: Info,
  log: ScrollText,
  marquee: Megaphone,
  timer: Timer,
  // Tables & grids
  table: Table,
  treegrid: Table2,
  grid: Grid3x3,
  gridcell: SquareMousePointer,
  cell: Grid2x2,
  row: Rows3,
  rowgroup: Rows4,
  rowheader: Rows2,
  columnheader: Columns3,
  // Lists & selection
  list: List,
  listitem: Dot,
  listbox: ListChecks,
  option: Check,
  combobox: SquareChevronDown,
  // Menus
  menu: SquareMenu,
  menubar: Menu,
  menuitem: MousePointerClick,
  menuitemcheckbox: SquareCheckBig,
  menuitemradio: CircleDotDashed,
  // Trees
  tree: ListTree,
  treeitem: FolderTree,
  // Form widgets
  button: RectangleHorizontal,
  link: Link2,
  checkbox: SquareCheck,
  radio: CircleDot,
  radiogroup: Boxes,
  group: Group,
  switch: ToggleRight,
  slider: SlidersHorizontal,
  spinbutton: ChevronsUpDown,
  textbox: TextCursorInput,
  searchbox: TextSearch,
  progressbar: LoaderCircle,
  meter: Gauge,
  tooltip: MessageSquare,
  separator: SeparatorHorizontal,
  scrollbar: MoveVertical,
  heading: Heading,
  // Document structure
  article: Newspaper,
  note: StickyNote,
  figure: Images,
  img: Image,
  feed: Rss,
  document: FileText,
  application: MonitorPlay,
  toolbar: Wrench,
  generic: SquareDashed,
  none: EyeOff,
  presentation: EyeOff,
  // Tabs (shared family icon)
  tab: SquareStack,
  tablist: SquareStack,
  tabpanel: SquareStack,
};

function roleIcon(role: AriaRole): LucideIcon {
  return ROLE_ICON[role.name] ?? CATEGORY_ICON[role.category];
}

export function AriaExplorer() {
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();

  const attributes = React.useMemo(() => {
    if (!q) return ARIA_ATTRIBUTES;
    return ARIA_ATTRIBUTES.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [q]);

  const roles = React.useMemo(() => {
    if (!q) return ARIA_ROLES;
    return ARIA_ROLES.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [q]);

  return (
    <div className="space-y-14">
      {/* Search */}
      <div>
        <label htmlFor="aria-search" className="sr-only">
          Search ARIA attributes and roles
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="aria-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ARIA attributes and roles…"
            aria-describedby="aria-search-status"
            className="h-14 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-base shadow-soft"
          />
        </div>
        <p id="aria-search-status" role="status" aria-live="polite" className="sr-only">
          {q
            ? `${attributes.length} attribute${attributes.length === 1 ? "" : "s"} and ${roles.length} role${roles.length === 1 ? "" : "s"} match “${query}”.`
            : ""}
        </p>
      </div>

      {/* ARIA attributes */}
      <section aria-labelledby="aria-attributes" className="space-y-4 scroll-mt-24">
        <div className="space-y-1">
          <h2
            id="aria-attributes"
            className="scroll-mt-28 text-2xl font-semibold tracking-tight"
          >
            ARIA attributes
          </h2>
          <p className="text-sm text-muted-foreground">
            States and properties you can apply to elements.
          </p>
        </div>

        {attributes.length === 0 ? (
          <EmptyState label="attributes" query={query} />
        ) : (
          <div
            role="region"
            aria-label="ARIA attributes, scrollable"
            tabIndex={0}
            className="max-h-[34rem] overflow-auto rounded-2xl border border-border bg-card shadow-soft"
          >
            <div className="min-w-[42rem]">
              {/* Visual column headers (each row below is a single link, so
                  these are presentational rather than real table headers). */}
              <div
                aria-hidden="true"
                className="sticky top-0 z-10 grid grid-cols-[11rem_8.5rem_1fr_1.5rem] items-center gap-4 border-b border-border bg-secondary/80 px-5 py-3 text-xs font-medium text-muted-foreground backdrop-blur"
              >
                <span>Name</span>
                <span>Type</span>
                <span>Description</span>
                <span />
              </div>
              <ul className="divide-y divide-border">
                {attributes.map((a) => (
                  <li key={a.name}>
                    <Link
                      href={`/aria/${a.name}`}
                      className="group grid grid-cols-[11rem_8.5rem_1fr_1.5rem] items-center gap-4 px-5 py-3 transition-colors hover:bg-secondary/50"
                    >
                      <span className="font-mono text-[0.8rem] font-medium group-hover:text-accent">
                        {a.name}
                      </span>
                      <span>
                        <span className="inline-flex whitespace-nowrap rounded-full border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {a.type}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {a.description}
                      </span>
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground/60"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ARIA roles */}
      <section aria-labelledby="aria-roles" className="space-y-4 scroll-mt-24">
        <div className="space-y-1">
          <h2
            id="aria-roles"
            className="scroll-mt-28 text-2xl font-semibold tracking-tight"
          >
            ARIA roles
          </h2>
          <p className="text-sm text-muted-foreground">
            Types of elements you can create.
          </p>
        </div>

        {roles.length === 0 ? (
          <EmptyState label="roles" query={query} />
        ) : (
          <ul className="grid list-none grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {roles.map((r) => {
              const Icon = roleIcon(r);
              return (
                <li key={r.name}>
                  <Link
                    href={`/aria/${r.name}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-accent"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                      </span>
                      {r.usedBy.length > 0 && (
                        <span
                          className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/10 px-1.5 text-xs font-semibold text-accent-text"
                          title={`${r.usedBy.length} component${r.usedBy.length === 1 ? "" : "s"} on this site use this role`}
                        >
                          {r.usedBy.length}
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-sm font-medium group-hover:text-accent">
                      {r.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.category} role
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({ label, query }: { label: string; query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/30 px-5 py-10 text-center text-sm text-muted-foreground">
      No {label} match{" "}
      <span className="font-medium text-foreground">“{query}”</span>.
    </div>
  );
}
