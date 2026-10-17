"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

export default function HeroCommandButton() {
  const [active, setActive] = useState(false);
  const [sequence, setSequence] = useState(0);

  const enter = () => {
    setActive(true);
    setSequence((value) => value + 1);
  };

  const leave = () => {
    setActive(false);
  };

  return (
    <a
      href="#work"
      data-cursor="interactive"
      onPointerEnter={enter}
      onPointerLeave={leave}
      onFocus={enter}
      onBlur={leave}
      className={[
        "km-command group relative inline-flex min-h-[58px]",
        "max-w-full items-center justify-between gap-6",
        "px-6 py-4 sm:px-7",
        "font-technical text-[11px] font-semibold",
        "tracking-[0.09em] sm:text-xs",
        "outline-none",
        active ? "km-command--active" : "",
      ].join(" ")}
    >
      {/* Four independent corner brackets */}
      <span className="km-command__corner km-command__corner--tl" />
      <span className="km-command__corner km-command__corner--tr" />
      <span className="km-command__corner km-command__corner--bl" />
      <span className="km-command__corner km-command__corner--br" />

      {/* Solid terminal selection */}
      <span aria-hidden="true" className="km-command__fill" />

      {/* Glitch layers — restart on every hover */}
      {active && (
        <span key={sequence} aria-hidden="true" className="km-command__glitch">
          <span className="km-command__glitch-slice km-command__glitch-slice--a">
            EXPLORE SELECTED WORK
          </span>
          <span className="km-command__glitch-slice km-command__glitch-slice--b">
            EXPLORE SELECTED WORK
          </span>
          <span className="km-command__glitch-slice km-command__glitch-slice--c">
            EXPLORE SELECTED WORK
          </span>
        </span>
      )}

      <span className="relative z-10 flex items-center gap-3">
        <span aria-hidden="true" className="km-command__prompt">
          █
        </span>

        <span className="km-command__label">EXPLORE SELECTED WORK</span>
      </span>

      <ArrowUpRight
        size={17}
        strokeWidth={1.7}
        aria-hidden="true"
        className="km-command__arrow relative z-10 shrink-0"
      />

      <style jsx>{`
        .km-command {
          isolation: isolate;
          color: #e8e8e5;
          background: transparent;
          -webkit-tap-highlight-color: transparent;
        }

        .km-command__corner {
          position: absolute;
          z-index: 3;
          width: 21px;
          height: 17px;
          border-color: #d71920;
          border-style: solid;
          border-width: 0;
          pointer-events: none;
          transition:
            transform 160ms steps(3, end),
            border-color 120ms steps(1, end);
        }

        .km-command__corner--tl {
          top: 0;
          left: 0;
          border-top-width: 2px;
          border-left-width: 2px;
        }

        .km-command__corner--tr {
          top: 0;
          right: 0;
          border-top-width: 2px;
          border-right-width: 2px;
        }

        .km-command__corner--bl {
          bottom: 0;
          left: 0;
          border-bottom-width: 2px;
          border-left-width: 2px;
        }

        .km-command__corner--br {
          bottom: 0;
          right: 0;
          border-bottom-width: 2px;
          border-right-width: 2px;
        }

        .km-command__fill {
          position: absolute;
          z-index: 0;
          inset: 6px;
          background: #d71920;
          opacity: 0;
          pointer-events: none;
        }

        .km-command__prompt {
          color: #d71920;
          font-family: monospace;
          font-size: 13px;
          transition: color 0ms;
        }

        .km-command__arrow {
          color: #d71920;
          transition:
            color 0ms,
            transform 160ms steps(3, end);
        }

        .km-command__label {
          white-space: nowrap;
        }

        .km-command--active .km-command__corner--tl {
          transform: translate(4px, 4px);
        }

        .km-command--active .km-command__corner--tr {
          transform: translate(-4px, 4px);
        }

        .km-command--active .km-command__corner--bl {
          transform: translate(4px, -4px);
        }

        .km-command--active .km-command__corner--br {
          transform: translate(-4px, -4px);
        }

        .km-command--active .km-command__fill {
          opacity: 1;
          animation: km-selection-in 380ms steps(1, end) both;
        }

        .km-command--active .km-command__prompt {
          color: #fff;
        }

        .km-command--active .km-command__arrow {
          color: #fff;
          transform: translate(3px, -3px);
        }

        .km-command__glitch {
          position: absolute;
          z-index: 5;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          font-family: monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .km-command__glitch-slice {
          position: absolute;
          top: 50%;
          left: 24px;
          white-space: nowrap;
          color: #fff;
          transform: translateY(-50%);
        }

        .km-command__glitch-slice--a {
          clip-path: inset(0 0 68% 0);
          animation: km-slice-a 380ms steps(1, end) both;
        }

        .km-command__glitch-slice--b {
          clip-path: inset(34% 0 34% 0);
          animation: km-slice-b 380ms steps(1, end) both;
        }

        .km-command__glitch-slice--c {
          clip-path: inset(68% 0 0 0);
          animation: km-slice-c 380ms steps(1, end) both;
        }

        .km-command:focus-visible {
          outline: 1px dashed #e8e8e5;
          outline-offset: 6px;
        }

        @keyframes km-selection-in {
          0% {
            opacity: 0;
            transform: scaleX(0.15);
            transform-origin: left;
          }
          13% {
            opacity: 1;
            transform: scaleX(0.36);
          }
          22% {
            opacity: 0;
            transform: scaleX(0.72);
          }
          32% {
            opacity: 1;
            transform: scaleX(0.82);
          }
          43% {
            opacity: 0.2;
            transform: scaleX(1);
          }
          53% {
            opacity: 1;
            transform: scaleX(1);
          }
          61% {
            opacity: 0;
          }
          69%,
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes km-slice-a {
          0%,
          10% {
            opacity: 0;
          }
          11% {
            opacity: 1;
            transform: translate(-7px, -50%);
          }
          22% {
            transform: translate(12px, -50%);
          }
          31% {
            opacity: 0;
          }
          42% {
            opacity: 1;
            transform: translate(-4px, -50%);
          }
          55%,
          100% {
            opacity: 0;
          }
        }

        @keyframes km-slice-b {
          0%,
          17% {
            opacity: 0;
          }
          18% {
            opacity: 1;
            transform: translate(10px, -50%);
          }
          28% {
            transform: translate(-11px, -50%);
          }
          38% {
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

        @keyframes km-slice-c {
          0%,
          7% {
            opacity: 0;
          }
          8% {
            opacity: 1;
            transform: translate(6px, -50%);
          }
          20% {
            transform: translate(-9px, -50%);
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

        @media (prefers-reduced-motion: reduce) {
          .km-command__corner,
          .km-command__arrow {
            transition: none;
          }

          .km-command__fill,
          .km-command__glitch-slice {
            animation: none;
          }

          .km-command--active .km-command__fill {
            opacity: 1;
          }

          .km-command__glitch {
            display: none;
          }
        }

        @media (max-width: 400px) {
          .km-command {
            padding-left: 15px;
            padding-right: 15px;
            gap: 12px;
            font-size: 10px;
          }

          .km-command__glitch-slice {
            left: 15px;
            font-size: 10px;
          }
        }
      `}</style>
    </a>
  );
}
