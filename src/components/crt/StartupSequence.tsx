"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase =
  | "checking"
  | "loading"
  | "blackout"
  | "spark"
  | "ignition"
  | "opening"
  | "stabilizing"
  | "finished";

const STORAGE_KEY = "km-startup-played";
const BLOCK_COUNT = 24;

// Three loading bursts with intentional pauses.
// All values are milliseconds from the start of loading.
const BLOCK_TIMINGS = [
  40, 75, 110, 145, 180, 215, 250, 285, 480, 515, 550, 585, 620, 655, 690, 725,
  930, 965, 1000, 1035, 1070, 1105, 1140, 1175,
];

export default function StartupSequence() {
  const [phase, setPhase] = useState<Phase>("checking");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback(() => {
    if (finished.current) return;

    finished.current = true;
    clearTimers();

    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage may be unavailable.
    }

    setPhase("finished");
  }, [clearTimers]);

  useEffect(() => {
    let shouldPlay = true;

    try {
      shouldPlay = sessionStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      // Continue without storage.
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shouldPlay = false;
    }

    const schedule = (callback: () => void, delay: number) => {
      timers.current.push(setTimeout(callback, delay));
    };

    if (!shouldPlay) {
      finished.current = true;
      schedule(() => setPhase("finished"), 0);
      return clearTimers;
    }

    // Approximately 2.3 seconds total.
    schedule(() => setPhase("loading"), 0);
    schedule(() => setPhase("blackout"), 1320);
    schedule(() => setPhase("spark"), 1430);
    schedule(() => setPhase("ignition"), 1500);
    schedule(() => setPhase("opening"), 1670);
    schedule(() => setPhase("stabilizing"), 2110);
    schedule(finish, 2300);

    return clearTimers;
  }, [clearTimers, finish]);

  useEffect(() => {
    if (phase === "finished") return;

    const skipOnKey = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        finish();
      }
    };

    window.addEventListener("keydown", skipOnKey);

    return () => window.removeEventListener("keydown", skipOnKey);
  }, [phase, finish]);

  if (phase === "finished") return null;

  const showLoading = phase === "loading";

  const showIgnition =
    phase === "spark" ||
    phase === "ignition" ||
    phase === "opening" ||
    phase === "stabilizing";

  return (
    <div
      className={`km-startup km-startup--${phase}`}
      role="button"
      tabIndex={0}
      aria-label="Skip startup animation"
      onClick={finish}
    >
      <div className="km-startup__glass">
        {/* Black masks reveal the actual website */}
        <div className="km-startup__mask km-startup__mask--top" />
        <div className="km-startup__mask km-startup__mask--bottom" />

        {/* DOS-style loading blocks */}
        {showLoading && (
          <div className="km-startup__loader" aria-hidden="true">
            <div className="km-startup__loader-header">
              <span>INITIALIZING_</span>
              <span>KM / 26</span>
            </div>

            <div className="km-startup__blocks">
              {Array.from({ length: BLOCK_COUNT }, (_, index) => (
                <span
                  key={index}
                  className="km-startup__block"
                  style={{
                    animationDelay: `${BLOCK_TIMINGS[index]}ms`,
                  }}
                />
              ))}
            </div>

            <div className="km-startup__loader-footer">
              <span>LOADING INTERFACE</span>
              <span className="km-startup__cursor">█</span>
            </div>
          </div>
        )}

        {/* Ignition with separate core and afterglow layers */}
        {showIgnition && (
          <div className="km-startup__ignition" aria-hidden="true">
            <div className="km-startup__ignition-halo" />
            <div className="km-startup__ignition-glow" />
            <div className="km-startup__ignition-core" />
          </div>
        )}

        {/* Electrical flash */}
        {phase === "ignition" && (
          <div className="km-startup__flash" aria-hidden="true" />
        )}

        {/* Final signal stabilization */}
        {phase === "stabilizing" && (
          <div className="km-startup__stabilize" aria-hidden="true" />
        )}

        {/* CRT texture */}
        <div className="km-startup__scanlines" aria-hidden="true" />
        <div className="km-startup__vignette" aria-hidden="true" />
      </div>

      <style jsx>{`
        .km-startup {
          position: fixed;
          inset: 0;
          z-index: 9999;
          overflow: hidden;
          background: transparent;
          cursor: pointer;
          isolation: isolate;
          -webkit-tap-highlight-color: transparent;
        }

        .km-startup__glass {
          position: absolute;
          inset: 0;
          overflow: hidden;
          clip-path: url(#lab-screen-clip);
          filter: url(#lab-curved-screen);
        }

        /* -----------------------------------
           CENTER-OUT WEBSITE REVEAL
        ----------------------------------- */

        .km-startup__mask {
          position: absolute;
          left: 0;
          width: 100%;
          height: 50%;
          z-index: 1;
          background: #030405;
          will-change: transform;
        }

        .km-startup__mask--top {
          top: 0;
          transform-origin: top center;
        }

        .km-startup__mask--bottom {
          bottom: 0;
          transform-origin: bottom center;
        }

        .km-startup--opening .km-startup__mask,
        .km-startup--stabilizing .km-startup__mask {
          animation: km-mask-shrink 440ms cubic-bezier(0.22, 0.65, 0.24, 1)
            forwards;
        }

        /* -----------------------------------
           RETRO DOS LOADER
        ----------------------------------- */

        .km-startup__loader {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 3;
          width: min(340px, 82vw);
          transform: translate(-50%, -50%);
          font-family: "Courier New", monospace;
        }

        .km-startup__loader-header,
        .km-startup__loader-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 10px;
          line-height: 1.5;
          letter-spacing: 0.08em;
        }

        .km-startup__loader-header {
          margin-bottom: 12px;
          color: #d71920;
        }

        .km-startup__loader-footer {
          margin-top: 12px;
          color: #8d9295;
        }

        .km-startup__blocks {
          display: grid;
          grid-template-columns: repeat(24, minmax(0, 1fr));
          gap: 3px;
          width: 100%;
        }

        .km-startup__block {
          display: block;
          height: 16px;
          background: #d71920;
          opacity: 0.1;
          animation: km-block-activate 1ms steps(1, end) forwards;
        }

        .km-startup__cursor {
          color: #d71920;
          animation: km-cursor-blink 500ms steps(1, end) infinite;
        }

        /* -----------------------------------
           CRT IGNITION
        ----------------------------------- */

        .km-startup__ignition {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 4;
          width: 100%;
          height: 2px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .km-startup__ignition-core,
        .km-startup__ignition-glow,
        .km-startup__ignition-halo {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          transform: translate(-50%, -50%);
        }

        .km-startup__ignition-core {
          height: 2px;
          background: #fff;
          box-shadow:
            0 0 5px rgba(255, 255, 255, 1),
            0 0 14px rgba(255, 255, 255, 0.95),
            0 0 26px rgba(255, 255, 255, 0.5);
        }

        .km-startup__ignition-glow {
          height: 16px;
          background: rgba(245, 248, 255, 0.5);
          filter: blur(8px);
        }

        .km-startup__ignition-halo {
          height: 54px;
          background: rgba(225, 235, 255, 0.22);
          filter: blur(24px);
        }

        /* Short center spark */

        .km-startup--spark .km-startup__ignition {
          width: 12%;
        }

        /* Horizontal stretch */

        .km-startup--ignition .km-startup__ignition {
          animation: km-line-stretch 140ms cubic-bezier(0.12, 0.8, 0.2, 1) both;
        }

        /*
          Keep the ignition full-width when
          transitioning into the reveal.
        */

        .km-startup--opening .km-startup__ignition,
        .km-startup--stabilizing .km-startup__ignition {
          width: 100%;
        }

        /* -----------------------------------
           PHOSPHOR PERSISTENCE
        ----------------------------------- */

        /*
          The bright core disappears quickly.
          The glow stays behind as an afterimage.
        */

        .km-startup--opening .km-startup__ignition-core {
          animation: km-core-afterglow 170ms ease-out forwards;
        }

        .km-startup--opening .km-startup__ignition-glow {
          animation: km-glow-afterimage 430ms ease-out forwards;
        }

        .km-startup--opening .km-startup__ignition-halo {
          animation: km-halo-afterimage 440ms ease-out forwards;
        }

        .km-startup--stabilizing .km-startup__ignition {
          opacity: 0;
        }

        /* -----------------------------------
           IGNITION FLASH
        ----------------------------------- */

        .km-startup__flash {
          position: absolute;
          top: 50%;
          left: 0;
          z-index: 5;
          width: 100%;
          height: 70px;
          transform: translateY(-50%);
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(240, 246, 255, 0.38) 28%,
            rgba(220, 232, 255, 0.1) 65%,
            transparent 100%
          );
          filter: blur(10px);
          animation: km-ignition-flash 100ms ease-out 65ms both;
        }

        /* -----------------------------------
           SIGNAL STABILIZATION
        ----------------------------------- */

        .km-startup__stabilize {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          background: rgba(255, 255, 255, 0.12);
          animation: km-signal-settle 190ms ease-out forwards;
        }

        /* -----------------------------------
           CRT TEXTURE
        ----------------------------------- */

        .km-startup__scanlines {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.22) 3px,
            rgba(0, 0, 0, 0.22) 4px
          );
          opacity: 0.65;
        }

        .km-startup__vignette {
          position: absolute;
          inset: 0;
          z-index: 7;
          pointer-events: none;
          background: radial-gradient(
            ellipse at center,
            transparent 52%,
            rgba(0, 0, 0, 0.2) 78%,
            rgba(0, 0, 0, 0.65) 100%
          );
        }

        /* -----------------------------------
           KEYFRAMES
        ----------------------------------- */

        @keyframes km-block-activate {
          from {
            opacity: 0.1;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes km-cursor-blink {
          0%,
          49% {
            opacity: 1;
          }

          50%,
          100% {
            opacity: 0;
          }
        }

        @keyframes km-line-stretch {
          from {
            width: 12%;
            opacity: 1;
          }

          to {
            width: 100%;
            opacity: 1;
          }
        }

        @keyframes km-core-afterglow {
          0% {
            opacity: 1;
          }

          40% {
            opacity: 0.75;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes km-glow-afterimage {
          0% {
            opacity: 1;
            filter: blur(8px);
          }

          35% {
            opacity: 0.75;
            filter: blur(12px);
          }

          70% {
            opacity: 0.35;
            filter: blur(18px);
          }

          100% {
            opacity: 0;
            filter: blur(22px);
          }
        }

        @keyframes km-halo-afterimage {
          0% {
            opacity: 1;
          }

          45% {
            opacity: 0.65;
          }

          75% {
            opacity: 0.3;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes km-ignition-flash {
          0% {
            opacity: 0;
          }

          35% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }

        @keyframes km-mask-shrink {
          from {
            transform: scaleY(1);
          }

          to {
            transform: scaleY(0);
          }
        }

        @keyframes km-signal-settle {
          0% {
            opacity: 0.75;
          }

          45% {
            opacity: 0.2;
          }

          100% {
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .km-startup {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
