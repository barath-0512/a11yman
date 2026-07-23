export interface SrRow {
  step: string;
  jawsChrome: string;
  nvdaFirefox: string;
  voiceOverSafari: string;
}

export function SrAnnouncementTable({ rows }: { rows: SrRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Expected screen reader announcements by assistive technology
        </caption>
        <thead className="bg-secondary/60 text-left">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Step / state
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              JAWS + Chrome
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              NVDA + Firefox
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              VoiceOver + Safari
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border align-top">
              <th scope="row" className="px-4 py-3 font-medium">
                {r.step}
              </th>
              <td className="px-4 py-3 text-muted-foreground">
                &ldquo;{r.jawsChrome}&rdquo;
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                &ldquo;{r.nvdaFirefox}&rdquo;
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                &ldquo;{r.voiceOverSafari}&rdquo;
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
