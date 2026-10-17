import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const runtime = "nodejs";

export const alt = "Kamyar Moniri — Frontend and Creative Developer";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontRegular = await readFile(
    new URL("../fonts/AlteHaasGroteskRegular.ttf", import.meta.url),
  );

  const fontBold = await readFile(
    new URL("../fonts/AlteHaasGroteskBold.ttf", import.meta.url),
  );

  const background = "#090909";
  const foreground = "#f0f0ed";
  const muted = "#929292";
  const red = "#d71920";
  const border = "#343434";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: background,
        color: foreground,
        position: "relative",
        overflow: "hidden",
        fontFamily: "Alte Haas",
      }}
    >
      {/* Technical background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          opacity: 0.22,
          backgroundImage: `
              linear-gradient(to right, #303030 1px, transparent 1px),
              linear-gradient(to bottom, #303030 1px, transparent 1px)
            `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Left red rail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 8,
          backgroundColor: red,
          display: "flex",
        }}
      />

      {/* Main layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "52px 64px 42px 72px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${border}`,
            paddingBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 10,
                height: 10,
                backgroundColor: red,
              }}
            />

            <span
              style={{
                fontSize: 17,
                letterSpacing: 3,
                fontWeight: 700,
              }}
            >
              KM / PORTFOLIO
            </span>
          </div>

          <span
            style={{
              fontSize: 15,
              color: muted,
              letterSpacing: 2,
            }}
          >
            SYSTEM ONLINE_
          </span>
        </div>

        {/* Main typography */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 142,
              fontWeight: 700,
              letterSpacing: -8,
              lineHeight: 0.96,
            }}
          >
            KAMYAR
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 142,
              fontWeight: 700,
              letterSpacing: -8,
              lineHeight: 1.04,
            }}
          >
            <span>MONIRI</span>
            <span style={{ color: red }}>.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                width: 42,
                height: 2,
                backgroundColor: red,
              }}
            />

            <span
              style={{
                color: red,
                fontSize: 23,
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              FRONTEND / CREATIVE DEVELOPER
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 23,
            borderTop: `1px solid ${border}`,
          }}
        >
          <span
            style={{
              color: muted,
              fontSize: 16,
              letterSpacing: 1.4,
            }}
          >
            REACT · NEXT.JS · TYPESCRIPT
          </span>

          <span
            style={{
              color: foreground,
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: 1.2,
            }}
          >
            KAMYARMONIRI.COM
          </span>
        </div>
      </div>

      {/* Decorative right-side index */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 63,
          top: 130,
          fontSize: 13,
          letterSpacing: 2,
          color: "#606060",
        }}
      >
        [ 001 / KM ]
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Alte Haas",
          data: fontRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Alte Haas",
          data: fontBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
