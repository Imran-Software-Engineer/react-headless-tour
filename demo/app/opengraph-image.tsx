import { ImageResponse } from "next/og";

export const alt = "react-headless-tour — product tours that wear your design system";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 34, opacity: 0.85, marginBottom: 18 }}>⛺ react-headless-tour</div>
        <div style={{ fontSize: 64, fontWeight: 700, textAlign: "center", lineHeight: 1.15, maxWidth: 980 }}>
          Product tours that wear your design system
        </div>
        <div style={{ fontSize: 28, opacity: 0.8, marginTop: 26 }}>
          Headless · Themeable · React 18 & 19 · Next.js ready
        </div>
      </div>
    ),
    size
  );
}
