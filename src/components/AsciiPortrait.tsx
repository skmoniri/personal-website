"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The full ASCII renderer is loaded only when the
// desktop component actually mounts.
const AsciiPortraitDesktop = dynamic(() => import("./AsciiPortraitDesktop"), {
  ssr: false,
  loading: () => null,
});

const DESKTOP_QUERY = "(min-width: 768px)";

const PORTRAIT_FILTER = [
  "saturate(0.65)",
  "brightness(1.08)",
  "contrast(1.06)",
  "drop-shadow(0 0 3px rgba(220,220,220,0.30))",
  "drop-shadow(0 0 8px rgba(210,210,210,0.10))",
].join(" ");

const SHIRT_POLYGON = `polygon(
  35% 55%,
  32% 58%,
  23% 62%,
  13% 68%,
  4% 75%,
  0% 79%,
  0% 100%,
  100% 100%,
  100% 79%,
  96% 75%,
  87% 68%,
  77% 62%,
  68% 58%,
  65% 55%
)`;

function MobileAsciiPortrait() {
  return (
    <div
      role="img"
      aria-label="ASCII character portrait of Kamyar Moniri"
      className="relative h-full w-full overflow-hidden bg-transparent"
    >
      <div
        className="
          absolute inset-0
          origin-center
          translate-y-[5%]
          sm:translate-y-[7%]
          scale-[1.15]
          sm:scale-[1.2]
        "
      >
        {/* Preserve the original black shirt backing */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "#000000",
            clipPath: SHIRT_POLYGON,
          }}
        />

        {/* Static PNG replaces the animated ASCII Canvas */}
        <img
          src="/ascii/ascii-art.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          fetchPriority="high"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
          style={{ filter: PORTRAIT_FILTER }}
        />
      </div>
    </div>
  );
}

export default function AsciiPortrait() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const updateViewport = () => {
      setIsDesktop(mediaQuery.matches);
    };

    updateViewport();

    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Mobile: PNG only, no ASCII Canvas renderer */}
      <div className="h-full w-full md:hidden">
        <MobileAsciiPortrait />
      </div>

      {/* Desktop: full original animated ASCII system */}
      <div className="hidden h-full w-full md:block">
        {isDesktop ? <AsciiPortraitDesktop /> : null}
      </div>
    </div>
  );
}
