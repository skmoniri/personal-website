"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import CRTLayer from "./CRTLayer";
import MainNav from "../layout/MainNav";
import Footer from "../sections/Footer";
import type { CrtSettings } from "../../types/crt";
import StartupSequence from "./StartupSequence";

const settings: CrtSettings = {
  enabled: true,
  curve: 35,
  lines: 80,
};

const SIGNAL_DURATION = 350;
const NAVIGATION_DELAY = 145;

export default function CRTDisplay({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [corrupting, setCorrupting] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateMobile();

    mediaQuery.addEventListener("change", updateMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateMobile);
    };
  }, []);

  const transitionLocked = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    function handleLinkClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor) return;

      if (
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);

      // Leave external links to the browser.
      if (destination.origin !== current.origin) return;

      // Leave same-page anchors alone.
      if (
        destination.pathname === current.pathname &&
        destination.search === current.search
      ) {
        return;
      }

      // Respect reduced-motion preferences.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Avoid overlapping transitions.
      if (transitionLocked.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      transitionLocked.current = true;

      setCorrupting(true);

      // Navigate while the screen is most distorted.
      timers.current.push(
        window.setTimeout(() => {
          router.push(
            destination.pathname + destination.search + destination.hash,
          );
        }, NAVIGATION_DELAY),
      );

      // Return the screen to normal.
      timers.current.push(
        window.setTimeout(() => {
          setCorrupting(false);
          transitionLocked.current = false;
          timers.current = [];
        }, SIGNAL_DURATION),
      );
    }

    // Capture the click before Next.js handles the Link.
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);

      timers.current.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [router]);

  return (
    <div className="lab-root">
      <svg
        className="lab-filter-defs"
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="lab-screen-clip" clipPathUnits="objectBoundingBox">
            <path d="M .012 .018 Q .5 -.002 .988 .018 Q 1.002 .5 .988 .982 Q .5 1.002 .012 .982 Q -.002 .5 .012 .018 Z" />
          </clipPath>

          {/* Existing CRT curvature */}
          <filter
            id="lab-curved-screen"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href="/crt-displacement.png"
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="displacement"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="displacement"
              scale={settings.enabled && !isMobile ? settings.curve * 1.75 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* NEW: Horizontal analog signal corruption */}
          <filter
            id="lab-signal-corruption"
            x="-8%"
            y="-2%"
            width="116%"
            height="104%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.085"
              numOctaves="1"
              seed="7"
              stitchTiles="stitch"
              result="noise"
            />

            {/* Keep displacement horizontal */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="
                1 0 0 0 0
                0 0 0 0 0.5
                0 0 0 0 0
                0 0 0 0 1
              "
              result="horizontalNoise"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="horizontalNoise"
              scale="85"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <CRTLayer settings={settings} />

      {settings.enabled && (
        <svg
          className="lab-crt-blackout"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#000000"
            fillRule="evenodd"
            d="M0 0 H1000 V1000 H0 Z M12 18 Q500 -2 988 18 Q1002 500 988 982 Q500 1002 12 982 Q-2 500 12 18 Z"
          />
        </svg>
      )}

      <div
        className={`lab-viewport ${
          settings.enabled ? "lab-viewport--warped" : ""
        } ${corrupting ? "lab-signal-active" : ""}`}
      >
        <div className="lab-page-shell" id="top">
          <MainNav />

          {children}

          <div className="lab-container lab-shared-footer">
            <Footer />
          </div>
        </div>

        {/* NEW: Brief interference overlay */}
        <div className="lab-signal-interference" aria-hidden="true" />
      </div>

      <StartupSequence />
    </div>
  );
}
