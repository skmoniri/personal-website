"use client";

import { useEffect, useRef, useState } from "react";
import SectionTitle from "../ui/SectionTitle";

const skills = [
  { name: "NEXT.JS", detail: "FRAMEWORK" },
  { name: "REACT", detail: "FRONTEND" },
  { name: "TYPESCRIPT", detail: "LANGUAGE" },
  { name: "TAILWIND CSS", detail: "STYLING" },
  { name: "EXPRESS.JS", detail: "BACKEND" },
  { name: "POSTGRESQL", detail: "DATABASE" },
];

const profileLines = [
  { label: "NAME", value: "KAMYAR MONIRI" },
  { label: "ROLE", value: "FRONTEND DEVELOPER" },
  { label: "EXPERIENCE", value: "FRONTEND / FULL-STACK" },
  { label: "TOOLS", value: "REACT / NEXT / TS" },
];

const phosphorGlow = {
  textShadow: `
    0 0 5px rgba(232, 232, 229, 0.45),
    0 0 15px rgba(232, 232, 229, 0.25),
    0 0 35px rgba(232, 232, 229, 0.12),
    0 0 65px rgba(232, 232, 229, 0.05)
  `,
};

const redOutline = {
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1.5px #d71920",
  textShadow: "none",
};

const redDot = {
  color: "#d71920",
  WebkitTextFillColor: "#d71920",
  WebkitTextStroke: "0px",
  textShadow: "none",
  filter: "none",
};

const CHARACTERS = "01#+:/%&@*";

function randomCharacter() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --------------------------------------------------
// ASCII SKILL
// --------------------------------------------------

function AsciiSkill({
  skill,
  detail,
  index,
}: {
  skill: string;
  detail: string;
  index: number;
}) {
  const [display, setDisplay] = useState(skill);
  const [active, setActive] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAnimation = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const animate = () => {
    clearAnimation();
    setActive(true);

    if (prefersReducedMotion()) {
      setDisplay(skill);
      return;
    }

    const letters = [...skill];

    const positions = letters
      .map((letter, i) => (/[A-Z]/.test(letter) ? i : -1))
      .filter((i) => i !== -1);

    const shuffled = [...positions];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const selected = shuffled.slice(
      0,
      Math.max(1, Math.ceil(positions.length * 0.4)),
    );

    const resolveFrames = new Map<number, number>();

    selected.forEach((position) => {
      resolveFrames.set(position, 5 + Math.floor(Math.random() * 7));
    });

    let frame = 0;
    const totalFrames = 12;

    setDisplay(
      letters
        .map((letter, i) => (selected.includes(i) ? randomCharacter() : letter))
        .join(""),
    );

    intervalRef.current = setInterval(() => {
      frame++;

      setDisplay(
        letters
          .map((letter, i) => {
            const resolveFrame = resolveFrames.get(i);

            if (resolveFrame === undefined) return letter;

            return frame >= resolveFrame ? letter : randomCharacter();
          })
          .join(""),
      );

      if (frame >= totalFrames) {
        setDisplay(skill);
        clearAnimation();
      }
    }, 38);
  };

  const reset = () => {
    clearAnimation();
    setActive(false);
    setDisplay(skill);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      tabIndex={0}
      onMouseEnter={animate}
      onMouseLeave={reset}
      onFocus={animate}
      onBlur={reset}
      aria-label={skill}
      className="group relative flex min-h-[43px] cursor-default items-center justify-between gap-2 border-b border-[var(--lab-line)] px-3 transition-colors duration-150 hover:bg-[#141618] focus-visible:bg-[#141618] focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 top-0 w-[2px] transition-colors duration-150 ${
          active ? "bg-accent" : "bg-transparent"
        }`}
      />

      <div className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 font-technical text-[10px] tracking-[0.08em] text-[#777b7e]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0 font-technical text-[12px] tracking-[0.055em] text-[#e8e8e5] sm:text-[13px]">
          <span aria-hidden="true">{display}</span>
          <span className="sr-only">{skill}</span>
        </span>
      </div>

      <span className="hidden shrink-0 font-technical text-[9px] tracking-[0.06em] text-[#666a6c] min-[420px]:block">
        {detail}
      </span>
    </div>
  );
}

// --------------------------------------------------
// TERMINAL PROFILE
// --------------------------------------------------

function scrambleValue(value: string) {
  return [...value]
    .map((character) =>
      character === " " || character === "/" ? character : randomCharacter(),
    )
    .join("");
}

function TerminalProfile() {
  const [active, setActive] = useState(false);

  const [decodedLines, setDecodedLines] = useState(
    profileLines.map((line) => line.value),
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAnimation = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startDecode = () => {
    clearAnimation();
    setActive(true);

    if (prefersReducedMotion()) {
      setDecodedLines(profileLines.map((line) => line.value));
      return;
    }

    const startFrames = [0, 4, 8, 12];
    const finishFrames = [10, 14, 18, 22];

    const totalFrames = 24;
    let frame = 0;

    setDecodedLines(profileLines.map((line) => scrambleValue(line.value)));

    intervalRef.current = setInterval(() => {
      frame++;

      const nextLines = profileLines.map((line, lineIndex) => {
        const start = startFrames[lineIndex];
        const finish = finishFrames[lineIndex];

        if (frame >= finish) return line.value;
        if (frame < start) return scrambleValue(line.value);

        const progress = (frame - start) / (finish - start);
        const revealCount = Math.floor(line.value.length * progress);

        return [...line.value]
          .map((character, i) => {
            if (character === " " || character === "/") {
              return character;
            }

            return i < revealCount ? character : randomCharacter();
          })
          .join("");
      });

      setDecodedLines(nextLines);

      if (frame >= totalFrames) {
        setDecodedLines(profileLines.map((line) => line.value));
        clearAnimation();
      }
    }, 35);
  };

  const stopDecode = () => {
    clearAnimation();
    setActive(false);
    setDecodedLines(profileLines.map((line) => line.value));
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      tabIndex={0}
      onMouseEnter={startDecode}
      onMouseLeave={stopDecode}
      onFocus={startDecode}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          stopDecode();
        }
      }}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden border border-[var(--lab-line)] bg-[#0b0c0d] transition-colors duration-200 hover:border-accent focus-visible:border-accent focus-visible:outline-none"
    >
      {/* Scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.035) 4px)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-3 border-b border-[var(--lab-line)] bg-[#111315] px-4 py-2.5">
        <span className="font-technical text-[10px] tracking-[0.1em] text-[#929497]">
          PROFILE.SYS
        </span>

        <span className="flex items-center gap-2 font-technical text-[10px] tracking-[0.07em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(215,25,32,0.7)]" />
          [ ACTIVE ]
        </span>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-4 py-3.5">
        <span className="mb-3 font-technical text-[10px] tracking-[0.09em] text-accent">
          &gt; USER PROFILE / LOADED
        </span>

        <div className="space-y-2.5">
          {profileLines.map((line, index) => (
            <div
              key={line.label}
              className="grid min-w-0 grid-cols-[74px_minmax(0,1fr)] gap-2 font-technical text-[11px] leading-relaxed tracking-[0.035em] min-[701px]:grid-cols-[85px_minmax(0,1fr)]"
            >
              <span className="text-[#929497]">{line.label}</span>

              <span className="min-w-0 break-words text-[#e8e8e5]">
                <span className="mr-2 text-accent">:</span>

                <span aria-hidden="true">
                  {active ? decodedLines[index] : line.value}
                </span>

                <span className="sr-only">{line.value}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#333638] pt-3 font-technical text-[10px] tracking-[0.07em] text-[#777b7e]">
          <span>SYS / IDENTITY VERIFIED</span>
          <span aria-hidden="true" className="text-accent">
            _
          </span>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// ABOUT SECTION
// --------------------------------------------------

export default function About() {
  return (
    <section className="lab-section" id="about">
      <SectionTitle
        number="02"
        title="ABOUT"
        note="PROFILE / SYSTEM INFORMATION"
      />

      {/* Editorial introduction */}
      <div className="grid grid-cols-1 items-end gap-5 border-b border-[var(--lab-line)] pb-6 pt-7 min-[701px]:grid-cols-[1.1fr_0.9fr] min-[701px]:gap-8 min-[701px]:pb-7 min-[701px]:pt-8">
        {/* Heading */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-1.5 w-1.5 bg-accent" />

            <span className="font-technical text-[10px] tracking-[0.12em] text-[#929497]">
              FRONTEND DEVELOPER / CREATIVE DEVELOPMENT
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.6rem,5.5vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.065em]">
            <span className="block text-[#e8e8e5]" style={phosphorGlow}>
              BUILT WITH
            </span>

            <span className="block" style={redOutline}>
              INTENTION<span style={redDot}>.</span>
            </span>
          </h2>
        </div>

        {/* Personal introduction */}
        <div className="min-w-0 pb-1">
          <span className="mb-3 block h-px w-7 bg-accent" />

          <p className="max-w-[460px] text-[clamp(14px,1.25vw,16px)] leading-[1.6] text-[#bfc1c2]">
            I&apos;m Kamyar, a frontend developer working primarily with React,
            Next.js, and TypeScript. I started out building interfaces from
            designs, and I&apos;ve since expanded into building complete
            applications, including backend APIs and databases.
          </p>

          <p className="mt-3 max-w-[460px] text-[clamp(13px,1.1vw,15px)] leading-[1.55] text-[#8e9294]">
            I enjoy working on the details that make a website feel good to use,
            while keeping the code clean and maintainable.
          </p>
        </div>
      </div>

      {/* Technical panels */}
      <div className="grid grid-cols-1 gap-5 pb-2 pt-6 min-[701px]:grid-cols-2 min-[701px]:gap-8 min-[701px]:pt-7">
        {/* Toolkit */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-technical text-[11px] tracking-[0.09em] text-[#e8e8e5]">
              01 / TOOLKIT
            </span>

            <span className="font-technical text-[10px] tracking-[0.07em] text-[#777b7e]">
              [ 06 MODULES ]
            </span>
          </div>

          {/* Two-column skills grid keeps height compact */}
          <div className="grid grid-cols-1 border-t border-[var(--lab-line)] min-[420px]:grid-cols-2">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className={
                  index % 2 === 0
                    ? "min-[420px]:border-r min-[420px]:border-[var(--lab-line)]"
                    : ""
                }
              >
                <AsciiSkill
                  skill={skill.name}
                  detail={skill.detail}
                  index={index}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-technical text-[10px] tracking-[0.04em] text-[#777b7e]">
            <span>+ PRISMA</span>
            <span>+ REST APIs</span>
            <span>+ GIT</span>
            <span>+ FIGMA</span>
          </div>
        </div>

        {/* Terminal profile */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="font-technical text-[11px] tracking-[0.09em] text-[#e8e8e5]">
              02 / SYSTEM PROFILE
            </span>

            <span className="font-technical text-[10px] tracking-[0.07em] text-[#777b7e]">
              [ READ ONLY ]
            </span>
          </div>

          <TerminalProfile />
        </div>
      </div>
    </section>
  );
}
