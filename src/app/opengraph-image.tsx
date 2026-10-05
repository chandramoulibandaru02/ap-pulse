import { ImageResponse } from "next/og";

export const alt = "AP Pulse — Andhra Pradesh News";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111111",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          color: "white",
          padding: "40px",
          border: "12px solid #c0392b",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#c0392b",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            AP
          </div>
          <div style={{ fontSize: "56px", fontWeight: "bold", letterSpacing: "-1px" }}>
            AP PULSE
          </div>
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#aaaaaa",
            fontStyle: "italic",
            letterSpacing: "1px",
          }}
        >
          Andhra in every Pulse
        </div>
        <div
          style={{
            marginTop: "30px",
            fontSize: "20px",
            color: "#888888",
            fontFamily: "sans-serif",
          }}
        >
          Breaking News • Politics • Districts • Crime • Sports • Entertainment
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
