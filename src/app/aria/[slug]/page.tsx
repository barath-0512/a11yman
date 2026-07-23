import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Diamond,
  Code2,
  Users,
  Info,
  ShieldCheck,
  CaseSensitive,
  Boxes,
  BookOpen,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CodeBlock } from "@/components/reference/code-block";
import {
  ARIA_ATTRIBUTES,
  ARIA_ROLES,
  getAriaAttribute,
  getAriaRole,
  getAriaAttributeDetail,
  getAriaRoleDetail,
  getAriaLongDescription,
  derivedValues,
  isGlobalAttribute,
  type AriaAttrType,
} from "@/lib/aria";
import { getComponent } from "@/lib/components-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return [
    ...ARIA_ATTRIBUTES.map((a) => ({ slug: a.name })),
    ...ARIA_ROLES.map((r) => ({ slug: r.name })),
  ];
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const attr = getAriaAttribute(params.slug);
  const role = getAriaRole(params.slug);
  const entry = attr ?? role;
  if (!entry) return { title: "ARIA reference" };
  return pageMetadata({
    title: `${entry.name} — ARIA ${attr ? "attribute" : "role"}`,
    description: entry.description,
    path: `/aria/${params.slug}`,
  });
}

// ── small presentational helpers ──────────────────────────────────────────

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

function RoleGroup({ label, roles }: { label: string; roles: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <Link key={r} href={`/aria/${r}`}>
            <Pill>{r}</Pill>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Info;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 border-t border-border py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
      <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {label}
      </div>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function valueGuidance(type: AriaAttrType): string {
  switch (type) {
    case "Integer":
      return "Any integer.";
    case "Number":
      return "Any number, typically within the widget's min/max range.";
    case "ID reference":
      return "The id of another element in the same document.";
    case "ID reference list":
      return "A space-separated list of element ids.";
    case "Token list":
      return "A space-separated list of allowed tokens.";
    default:
      return "Any string of text.";
  }
}

// ── sidebar ───────────────────────────────────────────────────────────────

function SidebarNav({
  kind,
  activeName,
}: {
  kind: "attribute" | "role";
  activeName: string;
}) {
  const items =
    kind === "attribute"
      ? [...ARIA_ATTRIBUTES].sort((a, b) => a.name.localeCompare(b.name))
      : [...ARIA_ROLES].sort((a, b) => a.name.localeCompare(b.name));
  const heading = kind === "attribute" ? "ARIA attributes" : "ARIA roles";
  const backHash = kind === "attribute" ? "#aria-attributes" : "#aria-roles";
  const allLabel = kind === "attribute" ? "All attributes" : "All roles";

  return (
    <aside className="hidden lg:block">
      <div className="lg:sticky lg:top-20 lg:-mx-2 lg:-my-1 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:px-2 lg:py-1">
        <div className="mb-3">
          <p className="text-lg font-semibold tracking-tight">{heading}</p>
          <p className="text-sm text-muted-foreground">{items.length} in total</p>
        </div>
        <Link
          href={`/aria${backHash}`}
          className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {allLabel}
        </Link>
        <ul className="space-y-0.5">
          {items.map((it) => {
            const active = it.name === activeName;
            return (
              <li key={it.name}>
                <Link
                  href={`/aria/${it.name}`}
                  aria-current={active ? "page" : undefined}
                  className={
                    "block rounded-r-lg border-l-2 py-1.5 pl-2.5 pr-3 font-mono text-sm transition-colors " +
                    (active
                      ? "border-accent bg-accent/10 font-medium text-accent-text"
                      : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                  }
                >
                  {it.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4">
          <p className="text-sm font-medium">New to ARIA?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Learn the basics and best practices.
          </p>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
          >
            Get started
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </aside>
  );
}

// ── page ──────────────────────────────────────────────────────────────────

export default function AriaDetailPage({ params }: { params: Params }) {
  const attr = getAriaAttribute(params.slug);
  const role = getAriaRole(params.slug);
  const entry = attr ?? role;
  if (!entry) notFound();

  const isAttr = Boolean(attr);
  const isGlobal = isAttr && isGlobalAttribute(entry.name);
  const kind: "attribute" | "role" = isAttr ? "attribute" : "role";
  const detail = isAttr
    ? getAriaAttributeDetail(entry.name)
    : getAriaRoleDetail(entry.name);

  const specUrl = `https://www.w3.org/TR/wai-aria-1.2/#${entry.name}`;
  const mdnUrl = isAttr
    ? `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/${entry.name}`
    : `https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/${entry.name}_role`;

  const heroCode = isAttr ? `${entry.name}="…"` : `role="${entry.name}"`;

  // Fuller explanation for the page subtitle; falls back to the terse
  // index one-liner if a long description hasn't been authored.
  const longDescription = getAriaLongDescription(entry.name) ?? entry.description;
  const isDeprecated = Boolean(attr?.deprecated ?? role?.deprecated);

  // attribute-only derived data
  const attrDetail = isAttr ? getAriaAttributeDetail(entry.name) : undefined;
  const values = attr
    ? attrDetail?.values ?? derivedValues(attr)
    : undefined;

  // role-only derived data
  const roleDetail = !isAttr ? getAriaRoleDetail(entry.name) : undefined;
  const usedByComponents = role
    ? role.usedBy.map((s) => getComponent(s)).filter((c): c is NonNullable<typeof c> => Boolean(c))
    : [];
  const exampleComponentSlug = role?.usedBy[0];

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main id="main" className="container flex-1 pb-16 pt-10">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
          <SidebarNav kind={kind} activeName={entry.name} />

          <article className="min-w-0">
            {/* mobile back link */}
            <Link
              href={`/aria${isAttr ? "#aria-attributes" : "#aria-roles"}`}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {isAttr ? "All attributes" : "All roles"}
            </Link>

            {/* header + hero */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                    {entry.name}
                  </h1>
                  <Badge>{isAttr ? attr!.type : `${role!.category} role`}</Badge>
                  {isDeprecated && (
                    <span className="inline-flex items-center rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive-text">
                      Deprecated
                    </span>
                  )}
                </div>
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {longDescription}
                </p>
              </div>

              {/* decorative hero */}
              <div
                aria-hidden="true"
                className="hidden shrink-0 items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-secondary/70 to-secondary/20 px-8 py-10 sm:flex"
              >
                <code className="rounded-lg bg-card px-3 py-2 font-mono text-sm text-accent-text shadow-soft">
                  {heroCode}
                </code>
              </div>
            </div>

            <div className="mt-8">
              {/* ── ATTRIBUTE sections ── */}
              {isAttr && (
                <>
                  {values ? (
                    <Section icon={Diamond} label="Values">
                      <dl className="space-y-4">
                        {values.map((v) => (
                          <div key={v.value}>
                            <dt className="font-mono text-sm font-medium text-foreground">
                              {v.value}
                            </dt>
                            <dd className="mt-0.5">{v.description}</dd>
                          </div>
                        ))}
                      </dl>
                    </Section>
                  ) : (
                    <Section icon={Diamond} label="Value">
                      {valueGuidance(attr!.type)}
                    </Section>
                  )}

                  {isGlobal ? (
                    <Section icon={Code2} label="Used on">
                      Any HTML element —{" "}
                      <code className="font-mono text-foreground">{entry.name}</code>{" "}
                      is a global property.
                    </Section>
                  ) : (
                    attrDetail?.usedOn &&
                    attrDetail.usedOn.length > 0 && (
                      <Section icon={Code2} label="Used on">
                        <div className="flex flex-wrap gap-2">
                          {attrDetail.usedOn.map((u) => (
                            <Pill key={u}>{u}</Pill>
                          ))}
                        </div>
                      </Section>
                    )
                  )}

                  {isGlobal ? (
                    <Section icon={Users} label="Associated roles">
                      Every ARIA role. As a global property,{" "}
                      <code className="font-mono text-foreground">{entry.name}</code>{" "}
                      is supported on all roles.
                    </Section>
                  ) : (
                    attrDetail?.usedInRoles &&
                    attrDetail.usedInRoles.length > 0 && (
                      <Section icon={Users} label="Associated roles">
                        {attrDetail.inheritsIntoRoles &&
                        attrDetail.inheritsIntoRoles.length > 0 ? (
                          <div className="space-y-4">
                            <RoleGroup label="Used in roles" roles={attrDetail.usedInRoles} />
                            <RoleGroup
                              label="Inherits into roles"
                              roles={attrDetail.inheritsIntoRoles}
                            />
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {attrDetail.usedInRoles.map((r) => (
                              <Link key={r} href={`/aria/${r}`}>
                                <Pill>{r}</Pill>
                              </Link>
                            ))}
                          </div>
                        )}
                      </Section>
                    )
                  )}

                </>
              )}

              {/* ── ROLE sections ── */}
              {!isAttr && (
                <>
                  <Section icon={Code2} label="Used on">
                    {roleDetail?.usedOn ??
                      `Applied to a container element via role="${entry.name}" (or an equivalent native element, where one exists).`}
                  </Section>

                  {roleDetail?.requiredProps && roleDetail.requiredProps.length > 0 && (
                    <Section icon={ShieldCheck} label="Required properties">
                      <ul className="space-y-1.5">
                        {roleDetail.requiredProps.map((p) => (
                          <li key={p.name}>
                            <code className="font-mono text-foreground">{p.name}</code>
                            {p.note && (
                              <span className="text-muted-foreground"> — {p.note}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}

                  {roleDetail?.accessibleName && (
                    <Section icon={CaseSensitive} label="Accessible name">
                      {roleDetail.accessibleName}
                    </Section>
                  )}

                  {usedByComponents.length > 0 && (
                    <Section icon={Boxes} label="Used by components">
                      <div className="flex flex-wrap gap-2">
                        {usedByComponents.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/components/${c.slug}`}
                            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium shadow-soft transition-colors hover:border-accent hover:text-accent"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </Section>
                  )}
                </>
              )}

              {/* ── Example (shared) ── */}
              {detail?.example && (
                <Section icon={Code2} label="Example">
                  <div className="space-y-3">
                    <CodeBlock code={detail.example} filename={heroCode} />
                    {exampleComponentSlug && (
                      <Link
                        href={`/components/${exampleComponentSlug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-text hover:underline"
                      >
                        See a live, tested example on the{" "}
                        {getComponent(exampleComponentSlug)?.name} page
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </Section>
              )}

              {/* ── References (shared) ── */}
              <Section icon={BookOpen} label="References">
                <ul className="space-y-2">
                  <li>
                    <a
                      href={specUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent-text underline underline-offset-2 hover:no-underline"
                    >
                      WAI-ARIA 1.2 specification
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                  <li>
                    <a
                      href={mdnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-accent-text underline underline-offset-2 hover:no-underline"
                    >
                      MDN Web Docs
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </Section>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
