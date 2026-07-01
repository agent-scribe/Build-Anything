import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0b0b0e 0%, #141418 50%, #1a1a2e 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, color: "#fafafa", marginBottom: 16 }}>
          Sbuild
        </div>
        <div style={{ fontSize: 28, color: "#a1a1aa", maxWidth: 600, textAlign: "center" }}>
          AI-powered website & store generator. Describe → Generate → Export.
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 18,
            color: "#6d5efc",
            background: "rgba(109, 94, 252, 0.1)",
            border: "1px solid rgba(109, 94, 252, 0.3)",
            borderRadius: 12,
            padding: "8px 24px",
          }}
        >
          webuild-studio.netlify.app
        </div>
      </div>
    ),
    { ...size },
  );
}
