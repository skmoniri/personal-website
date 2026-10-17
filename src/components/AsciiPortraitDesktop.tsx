"use client";

import { useEffect, useRef } from "react";

type Glyph = {
  char: string;
  x: number;
  y: number;
  color: string;
  index: number;
  seed: number;
  row: number;
  column: number;
};

type EffectName =
  | "decode"
  | "glitch"
  | "reverse"
  | "pulse"
  | "interference"
  | "binary"
  | "afterimage"
  | "stabilization";

type EffectConfig = {
  bandRow: number;
  bandHeight: number;
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  direction: number;
  seed: number;
};

const TXT_URL = "/ascii/ascii-art.txt";
const SVG_URL = "/ascii/ascii-art.svg";

const CELL_WIDTH = 4.8;
const CELL_HEIGHT = 8;
const FONT_SIZE = 8;

const RED = "#d71920";
const GLITCH_CHARS = "@#%&*+=-:.";
const FRAGMENT_CHARS = "+-=:/\\[]<>01#";

const FRAGMENT_COUNT = 60;
const NOISE_COUNT = 90;

const BACKGROUND_FPS = 30;
const SIGNAL_STEP_MS = 320;

const PORTRAIT_FILTER = [
  "saturate(0.75)",
  "brightness(1.2)",
  "contrast(1.08)",
  "drop-shadow(0 0 3px rgba(245,245,245,0.42))",
  "drop-shadow(0 0 9px rgba(235,235,235,0.16))",
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

function hash(value: number) {
  const n = Math.sin(value * 127.1 + 17.71) * 43758.5453;
  return n - Math.floor(n);
}

function randomChar(seed: number, frame: number) {
  const index = Math.floor(hash(seed + frame * 71.17) * GLITCH_CHARS.length);
  return GLITCH_CHARS[index];
}

function fallbackColor(char: string) {
  const shades: Record<string, string> = {
    "@": "#eeeeec",
    "#": "#dededb",
    "%": "#c9c9c6",
    "*": "#b5b5b2",
    "+": "#999b9b",
    "=": "#7d8080",
    "-": "#626666",
    ":": "#454949",
    ".": "#303434",
  };

  return shades[char] ?? "#999999";
}

export default function AsciiPortrait() {
  const animatedCanvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const backingCanvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const animatedCanvas = animatedCanvasRef.current;
    const noiseCanvas = noiseCanvasRef.current;
    const backingCanvas = backingCanvasRef.current;
    const svgImage = svgRef.current;

    if (!animatedCanvas || !noiseCanvas || !backingCanvas || !svgImage) {
      return;
    }

    const animatedCtx = animatedCanvas.getContext("2d");
    const noiseCtx = noiseCanvas.getContext("2d");
    const backingCtx = backingCanvas.getContext("2d");

    if (!animatedCtx || !noiseCtx || !backingCtx) return;

    let disposed = false;
    let raf = 0;
    let noiseRaf = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let svgObjectUrl: string | null = null;

    let glyphs: Glyph[] = [];
    let svgAvailable = false;
    let playing = false;
    let subjectMaskData: Uint8ClampedArray | null = null;

    let columns = 0;
    let rows = 0;
    let lastEffect: EffectName | null = null;

    // OPTIMIZATION:
    // Store characters that have completed the initial decode.
    // Each settled glyph is drawn only once.
    const settledCanvas = document.createElement("canvas");
    const settledCtx = settledCanvas.getContext("2d");
    let settledGlyphs = new Uint8Array(0);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setCanvasVisible = () => {
      animatedCanvas.style.opacity = "1";
      svgImage.style.opacity = "0";
    };

    const setFinalVisible = () => {
      if (svgAvailable) {
        svgImage.style.opacity = "1";
        animatedCanvas.style.opacity = "0";
      } else {
        svgImage.style.opacity = "0";
        animatedCanvas.style.opacity = "1";
      }
    };

    const prepareCanvases = (width: number, height: number) => {
      animatedCanvas.width = width;
      animatedCanvas.height = height;

      noiseCanvas.width = width;
      noiseCanvas.height = height;

      backingCanvas.width = width;
      backingCanvas.height = height;

      settledCanvas.width = width;
      settledCanvas.height = height;

      if (settledCtx) {
        settledCtx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
        settledCtx.textBaseline = "alphabetic";
        settledCtx.textAlign = "left";
      }

      for (const ctx of [animatedCtx, noiseCtx, backingCtx]) {
        ctx.textBaseline = "alphabetic";
        ctx.textAlign = "left";
        ctx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
      }
    };

    // --------------------------------------------------
    // ORIGINAL PORTRAIT BACKING
    // --------------------------------------------------

    const buildRowMap = (list: Glyph[]) => {
      const map = new Map<number, Glyph[]>();

      for (const glyph of list) {
        const current = map.get(glyph.row);

        if (current) {
          current.push(glyph);
        } else {
          map.set(glyph.row, [glyph]);
        }
      }

      for (const rowGlyphs of map.values()) {
        rowGlyphs.sort((a, b) => a.column - b.column);
      }

      return map;
    };

    const drawSubjectBacking = (list: Glyph[]) => {
      const width = backingCanvas.width;
      const height = backingCanvas.height;

      backingCtx.clearRect(0, 0, width, height);

      const rowMap = buildRowMap(list);
      backingCtx.fillStyle = "#000000";

      for (const glyph of list) {
        const { x, y, row } = glyph;
        const top = y - CELL_HEIGHT * 0.88;

        const isHair = row <= 28;
        const isUpperHead = row > 28 && row <= 45;
        const isFace = row > 45 && row <= 84;

        const padX = isHair ? 3.4 : isUpperHead ? 3.0 : isFace ? 2.45 : 4.8;

        const padY = isHair ? 3.1 : isUpperHead ? 2.8 : isFace ? 2.2 : 4.2;

        backingCtx.fillRect(
          x - padX,
          top - padY * 0.5,
          CELL_WIDTH + padX * 2,
          CELL_HEIGHT + padY,
        );
      }

      for (const rowGlyphs of rowMap.values()) {
        for (let i = 0; i < rowGlyphs.length - 1; i++) {
          const a = rowGlyphs[i];
          const b = rowGlyphs[i + 1];

          const gap = b.x - (a.x + CELL_WIDTH);
          const isShirt = a.row > 84;

          const bridgeLimit = isShirt ? CELL_WIDTH * 6.8 : CELL_WIDTH * 4.6;

          if (gap > 0 && gap <= bridgeLimit) {
            const top = a.y - CELL_HEIGHT * 0.82;

            backingCtx.fillRect(
              a.x + CELL_WIDTH - 0.5,
              top - 1,
              gap + 1,
              CELL_HEIGHT + 2,
            );
          }
        }
      }

      const sorted = [...list].sort(
        (a, b) => a.row - b.row || a.column - b.column,
      );

      for (let i = 0; i < sorted.length; i++) {
        const a = sorted[i];

        for (let j = i + 1; j < sorted.length; j++) {
          const b = sorted[j];

          if (b.row - a.row > 1) break;
          if (b.row === a.row) continue;

          const dx = Math.abs(b.x - a.x);

          if (dx <= CELL_WIDTH * 1.2) {
            const top = Math.min(a.y, b.y) - CELL_HEIGHT * 0.25;

            const heightBridge = Math.abs(b.y - a.y) + CELL_HEIGHT * 0.6;

            backingCtx.fillRect(
              Math.min(a.x, b.x) - 1.2,
              top,
              CELL_WIDTH + 2.4,
              heightBridge,
            );
          }
        }
      }

      subjectMaskData = backingCtx.getImageData(0, 0, width, height).data;
    };

    const protectedArea = (x: number, y: number) => {
      if (!subjectMaskData) return false;

      const ix = Math.max(0, Math.min(noiseCanvas.width - 1, Math.floor(x)));

      const iy = Math.max(0, Math.min(noiseCanvas.height - 1, Math.floor(y)));

      const index = (iy * noiseCanvas.width + ix) * 4 + 3;

      return subjectMaskData[index] > 10;
    };

    // --------------------------------------------------
    // ORIGINAL RED BACKGROUND
    // --------------------------------------------------

    const drawSignalBackground = (frame = 0, time = 0) => {
      const width = noiseCanvas.width;
      const height = noiseCanvas.height;

      noiseCtx.clearRect(0, 0, width, height);
      noiseCtx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
      noiseCtx.textBaseline = "alphabetic";
      noiseCtx.textAlign = "left";

      const drawProtectedChar = (
        char: string,
        x: number,
        y: number,
        alpha: number,
      ) => {
        if (
          x < 0 ||
          y < 0 ||
          x >= width ||
          y >= height ||
          protectedArea(x, y)
        ) {
          return;
        }

        noiseCtx.fillStyle = `rgba(215,25,32,${alpha})`;
        noiseCtx.fillText(char, x, y);
      };

      for (let i = 0; i < FRAGMENT_COUNT; i++) {
        const x =
          hash(i * 13.7 + 5.1) * width + Math.sin(time * 0.0008 + i * 2.4) * 2;

        const y = hash(i * 7.43 + 19.3) * height;

        const active = reducedMotion || hash(i * 5.27 + frame * 0.93) > 0.24;

        if (!active) continue;

        const length = 3 + Math.floor(hash(i * 9.31) * 9);
        const brightness = hash(i * 11.9 + frame * 0.37);

        const alpha = brightness > 0.9 ? 0.55 : brightness > 0.5 ? 0.3 : 0.15;

        for (let j = 0; j < length; j++) {
          if (hash(i * 17 + j * 4.7 + frame) < 0.16) {
            continue;
          }

          const charIndex = Math.floor(
            hash(i * 31.7 + j * 3.91 + frame * 1.17) * FRAGMENT_CHARS.length,
          );

          drawProtectedChar(
            FRAGMENT_CHARS[charIndex],
            x + j * CELL_WIDTH,
            y,
            alpha,
          );
        }
      }

      for (let i = 0; i < NOISE_COUNT; i++) {
        const x = hash(i * 19.17 + 31) * width;
        const y = hash(i * 23.81 + 47) * height;

        const visible = reducedMotion || hash(i * 3.77 + frame * 0.61) > 0.34;

        if (!visible) continue;

        const char =
          GLITCH_CHARS[
            Math.floor(hash(i * 6.73 + frame * 0.21) * GLITCH_CHARS.length)
          ];

        const alpha = 0.06 + hash(i * 2.31) * 0.14;

        drawProtectedChar(char, x, y, alpha);
      }
    };

    // --------------------------------------------------
    // EFFECT CONFIGURATION
    // --------------------------------------------------

    const createEffectConfig = (): EffectConfig => ({
      bandRow: Math.floor(Math.random() * Math.max(rows, 1)),
      bandHeight: 3 + Math.floor(Math.random() * 7),
      centerX: 0.2 + Math.random() * 0.6,
      centerY: 0.2 + Math.random() * 0.6,
      radiusX: 0.08 + Math.random() * 0.1,
      radiusY: 0.06 + Math.random() * 0.09,
      direction: Math.random() > 0.5 ? 1 : -1,
      seed: Math.random() * 10000,
    });

    // --------------------------------------------------
    // ASCII RENDERER
    // --------------------------------------------------

    const draw = (
      effect: EffectName | "static",
      progress = 1,
      frame = 0,
      config?: EffectConfig,
    ) => {
      // OPTIMIZED INITIAL DECODE
      //
      // The completed characters accumulate on settledCanvas.
      // Only actively decoding characters are drawn again.
      if (effect === "decode" && settledCtx) {
        animatedCtx.clearRect(
          0,
          0,
          animatedCanvas.width,
          animatedCanvas.height,
        );

        const unstable: Glyph[] = [];

        for (let i = 0; i < glyphs.length; i++) {
          const glyph = glyphs[i];

          const revealPoint = progress * 1.3 - glyph.seed * 0.3;

          if (revealPoint < 0) continue;

          if (revealPoint < 0.12) {
            unstable.push(glyph);
          } else if (!settledGlyphs[i]) {
            settledGlyphs[i] = 1;

            settledCtx.fillStyle = glyph.color;
            settledCtx.fillText(glyph.char, glyph.x, glyph.y);
          }
        }

        animatedCtx.drawImage(settledCanvas, 0, 0);

        animatedCtx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
        animatedCtx.textBaseline = "alphabetic";
        animatedCtx.textAlign = "left";
        animatedCtx.fillStyle = RED;

        for (const glyph of unstable) {
          animatedCtx.fillText(
            randomChar(glyph.index, frame),
            glyph.x,
            glyph.y,
          );
        }

        return;
      }

      // ORIGINAL RENDERER FOR ALL OTHER EFFECTS
      animatedCtx.clearRect(0, 0, animatedCanvas.width, animatedCanvas.height);

      animatedCtx.font = `${FONT_SIZE}px "Share Tech Mono", monospace`;
      animatedCtx.textBaseline = "alphabetic";
      animatedCtx.textAlign = "left";

      for (const glyph of glyphs) {
        const { char, x, y, color, index, seed, row, column } = glyph;

        let output = char;
        let outputColor = color;
        let offsetX = 0;

        // Fallback decode when persistent Canvas is unavailable.
        if (effect === "decode") {
          const revealPoint = progress * 1.3 - seed * 0.3;

          if (revealPoint < 0) continue;

          if (revealPoint < 0.12) {
            output = randomChar(index, frame);
            outputColor = RED;
          }
        }

        if (effect === "glitch") {
          const band = Math.floor((y / CELL_HEIGHT + frame * 2) / 5);

          const corrupt =
            Math.sin(index * 1.73 + frame * 4.1) > 0.87 && band % 3 === 0;

          if (corrupt) {
            output = randomChar(index, frame);
            outputColor = index % 5 === 0 ? RED : "#dededb";
          }
        }

        if (effect === "reverse") {
          const corruption =
            Math.sin(seed * 20 + frame * 0.9) >
            0.95 - Math.sin(progress * Math.PI) * 0.32;

          if (corruption) {
            output = randomChar(index, frame);
            outputColor = "#c8c8c8";
          }
        }

        if (effect === "pulse") {
          const active = Math.sin(index * 0.21 + frame * 0.55) > 0.992;

          if (active) {
            output = randomChar(index, frame);
            outputColor = RED;
          }
        }

        // SIGNAL INTERFERENCE
        if (effect === "interference" && config) {
          const travelingRow =
            config.bandRow + Math.floor(Math.sin(progress * Math.PI * 2) * 9);

          const distance = Math.abs(row - travelingRow);
          const insideBand = distance <= config.bandHeight;

          if (insideBand) {
            const intensity = 1 - distance / (config.bandHeight + 1);

            const corrupt =
              hash(index * 0.73 + frame * 7.1 + config.seed) <
              0.18 + intensity * 0.46;

            if (corrupt) {
              output = randomChar(index + config.seed, frame);

              outputColor = hash(index + frame) > 0.78 ? RED : "#b7b7b7";
            }

            if (hash(index * 0.39 + config.seed) > 0.72) {
              offsetX = config.direction * (2 + intensity * 5);
            }
          }
        }

        // BINARY GHOSTING
        if (effect === "binary" && config) {
          const nx = column / Math.max(columns, 1);
          const ny = row / Math.max(rows, 1);

          const dx = (nx - config.centerX) / config.radiusX;

          const dy = (ny - config.centerY) / config.radiusY;

          const insideRegion = dx * dx + dy * dy < 1;

          if (insideRegion) {
            const strength = Math.sin(progress * Math.PI);

            const corrupt =
              hash(index * 0.83 + frame * 2.7 + config.seed) < strength * 0.82;

            if (corrupt) {
              output = hash(index * 1.17 + frame) > 0.5 ? "1" : "0";

              outputColor = hash(index + config.seed) > 0.87 ? RED : "#c5c5c2";
            }
          }
        }

        // ASCII AFTERIMAGE
        if (effect === "afterimage" && config) {
          const bandDistance = Math.abs(row - config.bandRow);

          const insideBand = bandDistance < config.bandHeight * 2.5;

          const selected =
            hash(index * 1.31 + config.seed + Math.floor(frame / 2)) > 0.63;

          if (insideBand && selected) {
            const envelope = Math.sin(progress * Math.PI);

            const shift = config.direction * (3 + envelope * 7);

            animatedCtx.fillStyle = `rgba(215,25,32,${0.22 + envelope * 0.38})`;

            animatedCtx.fillText(char, x + shift, y);

            if (hash(index * 0.17 + config.seed) > 0.88) {
              animatedCtx.fillStyle = "rgba(145,30,35,0.25)";

              animatedCtx.fillText(char, x - shift * 0.5, y);
            }
          }
        }

        // SIGNAL STABILIZATION
        if (effect === "stabilization" && config) {
          const recovery = 1 - progress;
          const stage = Math.floor(progress * 7);
          const corruptionChance = recovery * 0.48;

          const corrupt =
            hash(index * 0.91 + stage * 13.7 + config.seed) < corruptionChance;

          if (corrupt) {
            output = randomChar(index + config.seed, frame);

            outputColor = hash(index * 0.31 + stage) > 0.83 ? RED : "#a8a8a8";
          }

          if (progress < 0.6 && hash(row * 1.91 + stage + config.seed) > 0.92) {
            offsetX = config.direction * (1 - progress) * 3;
          }
        }

        animatedCtx.fillStyle = outputColor;
        animatedCtx.fillText(output, x + offsetX, y);
      }
    };

    // --------------------------------------------------
    // ANIMATION SEQUENCING
    // --------------------------------------------------

    const chooseIdleEffect = (): EffectName => {
      const options: EffectName[] = [
        "interference",
        "interference",
        "binary",
        "binary",
        "afterimage",
        "glitch",
        "pulse",
        "reverse",
      ];

      let effect = options[Math.floor(Math.random() * options.length)];

      if (effect === lastEffect) {
        effect =
          options[
            (options.indexOf(effect) +
              1 +
              Math.floor(Math.random() * (options.length - 1))) %
              options.length
          ];
      }

      lastEffect = effect;
      return effect;
    };

    const effectDuration = (effect: EffectName) => {
      switch (effect) {
        case "decode":
          return 1800;
        case "interference":
          return 320;
        case "binary":
          return 600;
        case "afterimage":
          return 340;
        case "stabilization":
          return 280;
        case "reverse":
          return 480;
        case "glitch":
          return 230;
        case "pulse":
          return 340;
        default:
          return 350;
      }
    };

    const scheduleIdle = () => {
      if (disposed || reducedMotion) return;

      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      idleTimer = setTimeout(
        () => {
          if (disposed) return;

          if (document.hidden) {
            scheduleIdle();
            return;
          }

          const effect = chooseIdleEffect();
          play(effect, effectDuration(effect));
        },
        3800 + Math.random() * 5700,
      );
    };

    const play = (
      effect: EffectName,
      duration: number,
      recoveryConfig?: EffectConfig,
    ) => {
      if (disposed || playing) return;

      playing = true;

      const config = recoveryConfig ?? createEffectConfig();

      draw(effect, 0, 0, config);
      setCanvasVisible();

      let start = -1;
      let lastFrame = -1;

      const animate = (now: number) => {
        if (disposed) return;

        if (start < 0) start = now;

        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        const frame = Math.floor(elapsed / 50);

        if (frame !== lastFrame || progress === 1) {
          draw(effect, progress, frame, config);
          lastFrame = frame;
        }

        if (progress < 1) {
          raf = requestAnimationFrame(animate);
          return;
        }

        playing = false;

        const needsStabilization =
          effect === "interference" ||
          effect === "binary" ||
          effect === "afterimage";

        if (needsStabilization && !document.hidden && Math.random() < 0.8) {
          play("stabilization", effectDuration("stabilization"), config);
          return;
        }

        if (!svgAvailable) {
          draw("static");
        }

        setFinalVisible();
        scheduleIdle();
      };

      raf = requestAnimationFrame(animate);
    };

    // --------------------------------------------------
    // INITIALIZATION
    // --------------------------------------------------

    const initialize = async () => {
      try {
        const [textResponse, svgResponse] = await Promise.all([
          fetch(TXT_URL),
          fetch(SVG_URL),
        ]);

        if (!textResponse.ok) {
          throw new Error(`Unable to load ${TXT_URL}`);
        }

        const text = await textResponse.text();

        if (disposed) return;

        const lines = text.replace(/\r/g, "").split("\n");

        while (lines.length > 0 && lines[lines.length - 1] === "") {
          lines.pop();
        }

        columns = Math.max(0, ...lines.map((line) => line.length));

        rows = lines.length;

        if (!columns || !rows) {
          throw new Error("ASCII text file is empty");
        }

        const width = Math.ceil(columns * CELL_WIDTH);

        const height = Math.ceil(rows * CELL_HEIGHT);

        prepareCanvases(width, height);

        const colorMap = new Map<string, string>();

        if (svgResponse.ok) {
          const svgText = await svgResponse.text();

          if (disposed) return;

          const documentSVG = new DOMParser().parseFromString(
            svgText,
            "image/svg+xml",
          );

          if (!documentSVG.querySelector("parsererror")) {
            const nodes = documentSVG.querySelectorAll("text");

            nodes.forEach((node) => {
              const x = Number(node.getAttribute("x"));

              const y = Number(node.getAttribute("y"));

              const fill = node.getAttribute("fill");

              if (!Number.isFinite(x) || !Number.isFinite(y) || !fill) {
                return;
              }

              const column = Math.round(x / CELL_WIDTH);

              const row = Math.round(y / CELL_HEIGHT - 0.8);

              colorMap.set(`${row}:${column}`, fill);
            });

            const backgroundRect = documentSVG.querySelector("rect");

            if (
              backgroundRect?.getAttribute("fill")?.toLowerCase() === "#000000"
            ) {
              backgroundRect.remove();
            }

            const transparentSVG = new XMLSerializer().serializeToString(
              documentSVG.documentElement,
            );

            svgObjectUrl = URL.createObjectURL(
              new Blob([transparentSVG], {
                type: "image/svg+xml",
              }),
            );

            svgImage.src = svgObjectUrl;
            svgAvailable = true;
          }
        }

        const nextGlyphs: Glyph[] = [];

        for (let row = 0; row < rows; row++) {
          const line = lines[row];

          for (let column = 0; column < line.length; column++) {
            const char = line[column];

            if (!char || char === " ") {
              continue;
            }

            const index = row * columns + column;

            nextGlyphs.push({
              char,
              x: column * CELL_WIDTH,
              y: (row + 0.8) * CELL_HEIGHT,
              color: colorMap.get(`${row}:${column}`) ?? fallbackColor(char),
              index,
              seed: hash(index * 1.27),
              row,
              column,
            });
          }
        }

        glyphs = nextGlyphs;

        // One flag per glyph to track whether it
        // has been drawn onto the settled layer.
        settledGlyphs = new Uint8Array(glyphs.length);

        if (disposed) return;

        drawSubjectBacking(glyphs);
        drawSignalBackground();

        if (!reducedMotion) {
          let lastDrawTime = 0;

          const animateBackground = (now: number) => {
            if (disposed) return;

            const frameInterval = 1000 / BACKGROUND_FPS;

            if (!document.hidden && now - lastDrawTime >= frameInterval) {
              const signalFrame = Math.floor(now / SIGNAL_STEP_MS);

              drawSignalBackground(signalFrame, now);

              lastDrawTime = now;
            }

            noiseRaf = requestAnimationFrame(animateBackground);
          };

          noiseRaf = requestAnimationFrame(animateBackground);
        }

        if (reducedMotion) {
          if (!svgAvailable) {
            draw("static");
          }

          setFinalVisible();
        } else {
          play("decode", effectDuration("decode"));
        }
      } catch (error) {
        if (!disposed) {
          console.error("ASCII portrait initialization failed:", error);
        }
      }
    };

    initialize();

    return () => {
      disposed = true;

      cancelAnimationFrame(raf);
      cancelAnimationFrame(noiseRaf);

      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      if (svgObjectUrl) {
        URL.revokeObjectURL(svgObjectUrl);
      }
    };
  }, []);

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
          lg:translate-y-[9%]
          scale-[1.15]
          sm:scale-[1.2]
          lg:scale-[1.25]
        "
      >
        {/* Original shirt backing */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundColor: "#000000",
            clipPath: SHIRT_POLYGON,
          }}
        />

        {/* Red background fragments */}
        <canvas
          ref={noiseCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />

        {/* Original head and shirt backing */}
        <canvas
          ref={backingCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />

        {/* Animated ASCII portrait */}
        <canvas
          ref={animatedCanvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{
            opacity: 0,
            filter: PORTRAIT_FILTER,
          }}
        />

        {/* Original Grainrad SVG */}
        <img
          ref={svgRef}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          style={{
            opacity: 0,
            filter: PORTRAIT_FILTER,
          }}
        />
      </div>
    </div>
  );
}
