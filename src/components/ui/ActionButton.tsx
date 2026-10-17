"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type ButtonMode = "border" | "invert";

type ActionButtonProps = {
  mode: ButtonMode;
  label: string;
  href?: string;
  external?: boolean;
  fullWidth?: boolean;
};

export default function ActionButton({
  mode,
  label,
  href,
  external = false,
  fullWidth = false,
}: ActionButtonProps) {
  const [active, setActive] = useState(false);
  const [hit, setHit] = useState(false);
  const [glitchKey, setGlitchKey] = useState(0);

  const hitTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeRef = useRef(false);

  useEffect(() => {
    return () => {
      if (hitTimeout.current !== null) {
        clearTimeout(hitTimeout.current);
      }
    };
  }, []);

  const activate = () => {
    if (activeRef.current) return;

    activeRef.current = true;
    setActive(true);
    setGlitchKey((value) => value + 1);
  };

  const deactivate = () => {
    activeRef.current = false;
    setActive(false);
    setHit(false);

    if (hitTimeout.current !== null) {
      clearTimeout(hitTimeout.current);
      hitTimeout.current = null;
    }
  };

  const press = () => {
    setHit(true);

    if (hitTimeout.current !== null) {
      clearTimeout(hitTimeout.current);
    }

    hitTimeout.current = setTimeout(() => {
      setHit(false);
      hitTimeout.current = null;
    }, 140);
  };

  const className = [
    "km-action",
    `km-action--${mode}`,
    fullWidth ? "km-action--full" : "",
    active ? "km-action--active" : "",
    hit ? "km-action--hit" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {/* Corner brackets */}
      <span
        className="km-action__corner km-action__corner--tl"
        aria-hidden="true"
      />
      <span
        className="km-action__corner km-action__corner--tr"
        aria-hidden="true"
      />
      <span
        className="km-action__corner km-action__corner--bl"
        aria-hidden="true"
      />
      <span
        className="km-action__corner km-action__corner--br"
        aria-hidden="true"
      />

      {/* Red selection background */}
      <span className="km-action__selection" aria-hidden="true" />

      {/* Text and arrow */}
      <span className="km-action__content">
        <span className="km-action__label">{label}</span>

        <ArrowUpRight
          className="km-action__arrow"
          size={18}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </span>

      {/* Glitch layers */}
      {active && (
        <span key={glitchKey} className="km-action__glitch" aria-hidden="true">
          <span className="km-action__slice km-action__slice--top">
            {label}
          </span>

          <span className="km-action__slice km-action__slice--middle">
            {label}
          </span>

          <span className="km-action__slice km-action__slice--bottom">
            {label}
          </span>
        </span>
      )}
    </>
  );

  const sharedProps = {
    className,
    onPointerEnter: activate,
    onPointerLeave: deactivate,
    onFocus: activate,
    onBlur: deactivate,
    onPointerDown: press,
  };

  return (
    <>
      {href ? (
        <a
          href={href}
          {...sharedProps}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      ) : (
        <button type="button" {...sharedProps}>
          {content}
        </button>
      )}

      <style jsx global>{`
        /* -----------------------------------------
           BASE
        ----------------------------------------- */

        .km-action {
          --km-red: #d71920;
          --km-white: #e8e8e5;

          position: relative;
          isolation: isolate;

          display: inline-flex;
          min-height: 58px;
          max-width: 100%;

          align-items: center;
          justify-content: center;

          padding: 17px 25px;

          color: var(--km-white);
          background: transparent;

          font-family: var(--font-eurostile), monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-decoration: none;

          border: 0;
          border-radius: 0;

          cursor: pointer;
          outline: none;

          -webkit-tap-highlight-color: transparent;
        }

        .km-action--full {
          width: 100%;
          min-width: 0;
        }

        .km-action__content {
          position: relative;
          z-index: 2;

          display: flex;
          width: 100%;

          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .km-action--full .km-action__content {
          min-width: 0;
        }

        .km-action__label {
          position: relative;
          white-space: nowrap;
        }

        .km-action__arrow {
          flex-shrink: 0;
          color: var(--km-red);

          transition:
            color 0ms,
            transform 90ms steps(3, end);
        }

        /* -----------------------------------------
           CORNER BRACKETS
        ----------------------------------------- */

        .km-action__corner {
          position: absolute;
          z-index: 4;

          width: 20px;
          height: 17px;

          border: 0 solid var(--km-red);
          pointer-events: none;

          transition: transform 90ms steps(3, end);
        }

        .km-action__corner--tl {
          top: 0;
          left: 0;
          border-top-width: 2px;
          border-left-width: 2px;
        }

        .km-action__corner--tr {
          top: 0;
          right: 0;
          border-top-width: 2px;
          border-right-width: 2px;
        }

        .km-action__corner--bl {
          bottom: 0;
          left: 0;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }

        .km-action__corner--br {
          bottom: 0;
          right: 0;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .km-action--active .km-action__corner--tl {
          transform: translate(4px, 4px);
        }

        .km-action--active .km-action__corner--tr {
          transform: translate(-4px, 4px);
        }

        .km-action--active .km-action__corner--bl {
          transform: translate(4px, -4px);
        }

        .km-action--active .km-action__corner--br {
          transform: translate(-4px, -4px);
        }

        /* -----------------------------------------
           TERMINAL SELECTION
        ----------------------------------------- */

        .km-action__selection {
          position: absolute;
          z-index: 0;

          inset: 6px;

          background: var(--km-red);
          opacity: 0;
          pointer-events: none;
        }

        .km-action--active .km-action__selection {
          animation: km-action-selection 200ms steps(1, end) both;
        }

        .km-action--active {
          color: #fff;
        }

        .km-action--active .km-action__arrow {
          color: #fff;
          transform: translate(3px, -3px);
        }

        /* -----------------------------------------
           GLITCH TEXT
        ----------------------------------------- */

        .km-action__glitch {
          position: absolute;
          z-index: 3;

          inset: 0;

          overflow: hidden;
          pointer-events: none;

          font-family: var(--font-eurostile), monospace;
          font-size: inherit;
          font-weight: inherit;
          letter-spacing: inherit;
        }

        .km-action__slice {
          position: absolute;
          top: 50%;
          left: 25px;

          color: #fff;
          white-space: nowrap;

          transform: translateY(-50%);
        }

        .km-action__slice--top {
          clip-path: inset(0 0 67% 0);
          animation: km-action-slice-top 200ms steps(1, end) both;
        }

        .km-action__slice--middle {
          clip-path: inset(33% 0 34% 0);
          animation: km-action-slice-middle 200ms steps(1, end) both;
        }

        .km-action__slice--bottom {
          clip-path: inset(67% 0 0 0);
          animation: km-action-slice-bottom 200ms steps(1, end) both;
        }

        /* -----------------------------------------
           CLICK FEEDBACK
        ----------------------------------------- */

        .km-action--hit .km-action__content {
          transform: translate(1px, 1px);
        }

        .km-action--hit .km-action__corner--tl {
          transform: translate(6px, 6px);
        }

        .km-action--hit .km-action__corner--tr {
          transform: translate(-6px, 6px);
        }

        .km-action--hit .km-action__corner--bl {
          transform: translate(6px, -6px);
        }

        .km-action--hit .km-action__corner--br {
          transform: translate(-6px, -6px);
        }

        .km-action:focus-visible {
          outline: 1px dashed var(--km-white);
          outline-offset: 6px;
        }

        /* -----------------------------------------
           RED SELECTION ANIMATION
        ----------------------------------------- */

        @keyframes km-action-selection {
          0% {
            opacity: 0;
            clip-path: inset(0 0 0 0);
          }

          12% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }

          20% {
            opacity: 0;
          }

          29% {
            opacity: 1;
            clip-path: polygon(
              0 0,
              100% 0,
              100% 22%,
              0 22%,
              0 38%,
              100% 38%,
              100% 61%,
              0 61%,
              0 78%,
              100% 78%,
              100% 100%,
              0 100%
            );
          }

          40% {
            opacity: 0;
          }

          51% {
            opacity: 1;
            clip-path: inset(34% 0 18% 0);
          }

          61% {
            opacity: 0;
          }

          72% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }

          81% {
            opacity: 0.3;
          }

          90%,
          100% {
            opacity: 1;
            clip-path: inset(0 0 0 0);
          }
        }

        /* -----------------------------------------
           TOP GLITCH SLICE
        ----------------------------------------- */

        @keyframes km-action-slice-top {
          0%,
          9% {
            opacity: 0;
          }

          10% {
            opacity: 1;
            transform: translate(-8px, -50%);
          }

          22% {
            transform: translate(12px, -50%);
          }

          31% {
            opacity: 0;
          }

          42% {
            opacity: 1;
            transform: translate(-5px, -50%);
          }

          55%,
          100% {
            opacity: 0;
          }
        }

        /* -----------------------------------------
           MIDDLE GLITCH SLICE
        ----------------------------------------- */

        @keyframes km-action-slice-middle {
          0%,
          16% {
            opacity: 0;
          }

          17% {
            opacity: 1;
            transform: translate(11px, -50%);
          }

          29% {
            transform: translate(-12px, -50%);
          }

          39% {
            opacity: 0;
          }

          49% {
            opacity: 1;
            transform: translate(5px, -50%);
          }

          64%,
          100% {
            opacity: 0;
          }
        }

        /* -----------------------------------------
           BOTTOM GLITCH SLICE
        ----------------------------------------- */

        @keyframes km-action-slice-bottom {
          0%,
          7% {
            opacity: 0;
          }

          8% {
            opacity: 1;
            transform: translate(7px, -50%);
          }

          20% {
            transform: translate(-10px, -50%);
          }

          29% {
            opacity: 0;
          }

          46% {
            opacity: 1;
            transform: translate(14px, -50%);
          }

          62%,
          100% {
            opacity: 0;
          }
        }

        /* -----------------------------------------
           REDUCED MOTION
        ----------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .km-action__corner,
          .km-action__arrow {
            transition: none;
          }

          .km-action__selection,
          .km-action__slice {
            animation: none !important;
          }

          .km-action--active .km-action__selection {
            opacity: 1;
            clip-path: none;
          }

          .km-action__glitch {
            display: none;
          }
        }

        /* -----------------------------------------
           MOBILE
        ----------------------------------------- */

        @media (max-width: 400px) {
          .km-action {
            min-height: 54px;
            padding: 15px;
            font-size: 10px;
          }

          .km-action__content {
            gap: 12px;
          }

          .km-action__slice {
            left: 15px;
          }
        }
      `}</style>
    </>
  );
}
