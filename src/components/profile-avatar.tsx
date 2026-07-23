"use client";

import * as React from "react";

/**
 * Profile photo with a graceful fallback to an initial block.
 * Drop the image at public/profile.png to display it.
 */
export function ProfileAvatar() {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-accent text-4xl font-semibold text-accent-foreground shadow-soft">
        B
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/profile.png"
      alt="Barath, the maker of this site"
      className="h-28 w-28 shrink-0 rounded-2xl border border-border object-cover shadow-soft"
      onError={() => setFailed(true)}
    />
  );
}
