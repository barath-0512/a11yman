import { ImageResponse } from "next/og";

// Social share card (Open Graph + Twitter), generated at build time.
export const alt = "a11yman — Build. Test. Ship. Accessible.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eaf1ff 0%, #ffffff 55%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 12,
            background: "#2b7fff",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 108,
            fontWeight: 800,
            letterSpacing: -4,
            color: "#18181b",
          }}
        >
          a<span style={{ color: "#2b7fff" }}>11</span>yman
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 56,
            fontWeight: 800,
            color: "#18181b",
          }}
        >
          Build. Test. Ship. Accessible.
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            color: "#52525b",
            maxWidth: 960,
            lineHeight: 1.35,
          }}
        >
          A practical WCAG 2.2 AA UI component reference — ARIA, keyboard, screen
          readers &amp; ready-to-use test cases.
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 30,
            fontWeight: 700,
            color: "#2b7fff",
          }}
        >
          a11yman.com
        </div>
      </div>
    ),
    { ...size }
  );
}
