import * as React from "react";
import Link from "next/link";
import { getAriaAttribute, getAriaRole } from "@/lib/aria";

/**
 * Turn ARIA tokens inside a plain string into links to their reference page:
 * - `aria-*` attributes → /aria/<name>
 * - `role="<name>"`      → /aria/<name> (only the role name is linked)
 *
 * A token is only linked when a matching reference page actually exists, so
 * attributes/roles we don't document (and non-ARIA text like "hidden
 * attribute") are left untouched — no links to 404s.
 */
const TOKEN = /(aria-[a-z]+(?:-[a-z]+)*)|role="([a-z]+)"/gi;

const linkClass =
  "rounded text-accent-text underline decoration-dotted underline-offset-2 transition-colors hover:decoration-solid";

export function linkifyAria(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(text)) !== null) {
    const [full, attr, role] = match;
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (attr && getAriaAttribute(attr.toLowerCase())) {
      nodes.push(
        <Link key={key++} href={`/aria/${attr.toLowerCase()}`} className={linkClass}>
          {attr}
        </Link>
      );
    } else if (role && getAriaRole(role.toLowerCase())) {
      // Keep the surrounding role="…" but link only the role name.
      nodes.push(
        <React.Fragment key={key++}>
          {'role="'}
          <Link href={`/aria/${role.toLowerCase()}`} className={linkClass}>
            {role}
          </Link>
          {'"'}
        </React.Fragment>
      );
    } else {
      nodes.push(full); // no reference page — leave as plain text
    }

    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}
