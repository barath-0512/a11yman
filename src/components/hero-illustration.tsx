/**
 * Decorative hero illustration for the home page: a macOS-style browser window
 * showing a single "Continue" button, ringed by six floating callout cards
 * (Semantic HTML, ARIA, Keyboard, Screen Reader, Focus Visible, WCAG) connected
 * to it with thin lines — a "blueprint" of what makes one component accessible.
 *
 * Purely presentational: the parent marks it aria-hidden. It's a single inline
 * SVG so the connector lines stay precise and everything scales with the column
 * width. Colors use the site's theme tokens via Tailwind fill-/stroke- classes,
 * so it adapts to light and dark automatically.
 */

type IconType = "tab" | "aria" | "kbd" | "sr" | "eye" | "shield";

interface Callout {
  x: number; // card top-left x
  y: number; // card top-left y
  side: "left" | "right";
  label: string;
  sub: string;
  icon: IconType;
  node: [number, number]; // the connection dot on the dashed selection box
}

const CARD_W = 152;
const CARD_H = 88;

const CALLOUTS: Callout[] = [
  { x: 12, y: 104, side: "left", label: "Focusable", sub: 'tabindex="0"', icon: "tab", node: [272, 236] },
  { x: 12, y: 216, side: "left", label: "Keyboard", sub: "Enter · Space", icon: "kbd", node: [272, 262] },
  { x: 12, y: 356, side: "left", label: "Focus Visible", sub: "Visible focus ring", icon: "eye", node: [272, 288] },
  { x: 556, y: 104, side: "right", label: "ARIA", sub: 'role="button"', icon: "aria", node: [448, 236] },
  { x: 556, y: 216, side: "right", label: "Screen Reader", sub: "“Continue, button”", icon: "sr", node: [448, 262] },
  { x: 556, y: 356, side: "right", label: "WCAG 4.1.2", sub: "Name · Role · Value", icon: "shield", node: [448, 288] },
];

/** A monochrome accent icon centered at (cx, cy) in an ~22px box. */
function CalloutIcon({ type, cx, cy }: { type: IconType; cx: number; cy: number }) {
  const stroke = {
    className: "stroke-accent",
    fill: "none",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "tab":
      // Tab-key glyph (⇥): an arrow into a stop, evoking tabindex / tab order.
      return (
        <g {...stroke}>
          <path d={`M${cx - 8} ${cy} L${cx + 4} ${cy}`} />
          <path d={`M${cx} ${cy - 4} L${cx + 4} ${cy} L${cx} ${cy + 4}`} />
          <path d={`M${cx + 7} ${cy - 6} L${cx + 7} ${cy + 6}`} />
        </g>
      );
    case "aria":
      return (
        <g>
          <rect
            x={cx - 10}
            y={cy - 10}
            width={20}
            height={20}
            rx={5}
            className="stroke-accent"
            fill="none"
            strokeWidth={1.8}
          />
          <text
            x={cx}
            y={cy + 0.5}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={700}
            className="fill-accent"
          >
            A
          </text>
        </g>
      );
    case "kbd":
      return (
        <g className="stroke-accent" fill="none" strokeWidth={1.8} strokeLinecap="round">
          <rect x={cx - 11} y={cy - 8} width={22} height={16} rx={3} strokeWidth={1.8} />
          <g strokeWidth={2}>
            <path d={`M${cx - 6} ${cy - 2.5} h0.1`} />
            <path d={`M${cx - 2} ${cy - 2.5} h0.1`} />
            <path d={`M${cx + 2} ${cy - 2.5} h0.1`} />
            <path d={`M${cx + 6} ${cy - 2.5} h0.1`} />
          </g>
          <path d={`M${cx - 5} ${cy + 3.5} h10`} />
        </g>
      );
    case "sr":
      return (
        <g>
          <path
            d={`M${cx - 9} ${cy - 3.5} L${cx - 4} ${cy - 3.5} L${cx + 1} ${cy - 8} L${cx + 1} ${cy + 8} L${cx - 4} ${cy + 3.5} L${cx - 9} ${cy + 3.5} Z`}
            className="fill-accent stroke-accent"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <g className="stroke-accent" fill="none" strokeWidth={1.8} strokeLinecap="round">
            <path d={`M${cx + 4} ${cy - 4} A 5 5 0 0 1 ${cx + 4} ${cy + 4}`} />
            <path d={`M${cx + 7} ${cy - 7} A 9 9 0 0 1 ${cx + 7} ${cy + 7}`} />
          </g>
        </g>
      );
    case "eye":
      return (
        <g className="stroke-accent" fill="none" strokeWidth={1.8} strokeLinejoin="round">
          <path
            d={`M${cx - 10} ${cy} C ${cx - 4} ${cy - 7} ${cx + 4} ${cy - 7} ${cx + 10} ${cy} C ${cx + 4} ${cy + 7} ${cx - 4} ${cy + 7} ${cx - 10} ${cy} Z`}
          />
          <circle cx={cx} cy={cy} r={3} className="fill-accent stroke-accent" />
        </g>
      );
    case "shield":
      return (
        <g className="stroke-accent" fill="none" strokeWidth={1.8} strokeLinejoin="round">
          <path
            d={`M${cx} ${cy - 10} L${cx + 9} ${cy - 6} L${cx + 9} ${cy + 1} C ${cx + 9} ${cy + 7} ${cx + 5} ${cy + 10} ${cx} ${cy + 11} C ${cx - 5} ${cy + 10} ${cx - 9} ${cy + 7} ${cx - 9} ${cy + 1} L${cx - 9} ${cy - 6} Z`}
          />
          <path d={`M${cx - 4} ${cy} L${cx - 1} ${cy + 3.5} L${cx + 5} ${cy - 3}`} strokeWidth={2} strokeLinecap="round" />
        </g>
      );
  }
}

export function HeroIllustration() {
  return (
    <svg
      viewBox="0 34 720 428"
      className="h-auto w-full"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgb(15 23 42)" floodOpacity="0.10" />
        </filter>
        <filter id="hero-shadow-sm" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgb(15 23 42)" floodOpacity="0.10" />
        </filter>
        <pattern id="hero-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" className="fill-border" opacity="0.6" />
        </pattern>
        <clipPath id="hero-win">
          <rect x="150" y="44" width="420" height="392" rx="18" />
        </clipPath>
      </defs>

      {/* ── Browser window ── */}
      <g filter="url(#hero-shadow)">
        <rect x="150" y="44" width="420" height="392" rx="18" className="fill-card stroke-border" strokeWidth="1" />
      </g>
      {/* body dot grid + chrome bar, clipped to the rounded window */}
      <g clipPath="url(#hero-win)">
        <rect x="150" y="84" width="420" height="352" fill="url(#hero-dots)" />
        <rect x="150" y="44" width="420" height="40" className="fill-secondary" opacity="0.6" />
      </g>
      <line x1="150" y1="84" x2="570" y2="84" className="stroke-border" strokeWidth="1" />

      {/* traffic lights */}
      <circle cx="172" cy="64" r="5" fill="#ff5f57" />
      <circle cx="188" cy="64" r="5" fill="#febc2e" />
      <circle cx="204" cy="64" r="5" fill="#28c840" />
      {/* back / forward */}
      <g className="stroke-muted-foreground" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
        <path d="M228 60 l-4 4 l4 4" />
        <path d="M242 60 l4 4 l-4 4" />
      </g>
      {/* URL pill */}
      <rect x="272" y="54" width="176" height="20" rx="10" className="fill-background stroke-border" strokeWidth="1" />
      <path d="M283 61 v-1.5 a2 2 0 0 1 4 0 v1.5 M282 61 h6 v5 h-6 z" className="stroke-muted-foreground" fill="none" strokeWidth="1.1" strokeLinejoin="round" />
      <text x="362" y="64.5" textAnchor="middle" dominantBaseline="central" fontSize="10" className="fill-muted-foreground">a11yman.com</text>
      <g transform="translate(432.5 58.5) scale(0.46)" className="stroke-muted-foreground" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </g>
      {/* kebab menu */}
      <g className="fill-muted-foreground" opacity="0.7">
        <circle cx="550" cy="58" r="1.4" />
        <circle cx="550" cy="64" r="1.4" />
        <circle cx="550" cy="70" r="1.4" />
      </g>

      {/* ── Central button + selection box ── */}
      <rect x="272" y="222" width="176" height="80" rx="16" className="stroke-accent" fill="none" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.55" />
      <g filter="url(#hero-shadow-sm)">
        <rect x="285" y="236" width="150" height="52" rx="12" className="fill-accent" />
      </g>
      <text x="360" y="263" textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight={600} className="fill-accent-foreground">Continue</text>

      {/* ── Connector lines ── */}
      <g className="stroke-border" fill="none" strokeWidth="1.5">
        {CALLOUTS.map((c) => {
          const cy = c.y + CARD_H / 2;
          const [nx, ny] = c.node;
          const startX = c.side === "left" ? c.x + CARD_W : c.x;
          const ctrlX = c.side === "left" ? startX + 52 : startX - 52;
          return (
            <path
              key={`line-${c.label}`}
              d={`M${startX} ${cy} C ${ctrlX} ${cy} ${ctrlX} ${ny} ${nx} ${ny}`}
            />
          );
        })}
      </g>
      {/* connection nodes on the selection box */}
      {CALLOUTS.map((c) => (
        <circle key={`node-${c.label}`} cx={c.node[0]} cy={c.node[1]} r="4" className="fill-accent stroke-card" strokeWidth="2" />
      ))}
      {/* small dots where lines meet each card */}
      {CALLOUTS.map((c) => {
        const cy = c.y + CARD_H / 2;
        const dotX = c.side === "left" ? c.x + CARD_W : c.x;
        return <circle key={`edge-${c.label}`} cx={dotX} cy={cy} r="2.5" className="fill-accent" />;
      })}

      {/* ── Callout cards ── */}
      {CALLOUTS.map((c) => (
        <g key={`card-${c.label}`}>
          <g filter="url(#hero-shadow-sm)">
            <rect x={c.x} y={c.y} width={CARD_W} height={CARD_H} rx="14" className="fill-card stroke-border" strokeWidth="1" />
          </g>
          <CalloutIcon type={c.icon} cx={c.x + 30} cy={c.y + 30} />
          <text x={c.x + 18} y={c.y + 58} fontSize="14" fontWeight={600} className="fill-foreground">{c.label}</text>
          <text x={c.x + 18} y={c.y + 74} fontSize="10.5" className="fill-muted-foreground" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">{c.sub}</text>
        </g>
      ))}
    </svg>
  );
}
