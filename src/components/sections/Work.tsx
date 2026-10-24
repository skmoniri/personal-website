
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import { work, type WorkProject } from "../../data/projects";

/* -----------------------------------------
   CONFIGURATION
----------------------------------------- */

const phosphorGlow = {
  textShadow: `
    0 0 5px rgba(232, 232, 229, 0.45),
    0 0 15px rgba(232, 232, 229, 0.25),
    0 0 35px rgba(232, 232, 229, 0.12),
    0 0 65px rgba(232, 232, 229, 0.05)
  `,
};

const CHARACTERS = "01#+:/%&@*";
const ENCODE_AMOUNT = 0.35;

const TOTAL_FRAMES = 14;
const FRAME_INTERVAL = 50;

/* -----------------------------------------
   ASCII UTILITIES
----------------------------------------- */

function randomCharacter(): string {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function getEncodedPositions(name: string): number[] {
  const validPositions = [...name]
    .map((character, index) => (character === " " ? -1 : index))
    .filter((index) => index !== -1);

  const amount = Math.max(
    1,
    Math.round(validPositions.length * ENCODE_AMOUNT)
  );

  const shuffled = [...validPositions].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, amount);
}

/* -----------------------------------------
   ASCII TITLE
----------------------------------------- */

type AsciiTitleProps = {
  name: string;
  active: boolean;
};

function AsciiTitle({ name, active }: AsciiTitleProps) {
  const [display, setDisplay] = useState(name);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    const initialTimer = window.setTimeout(handleChange, 0);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      window.clearTimeout(initialTimer);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) {
      return;
    }

    const letters = [...name];
    const encodedPositions = getEncodedPositions(name);

    let frame = 0;

    const startFrames = new Map<number, number>();

    encodedPositions.forEach((index) => {
      startFrames.set(
        index,
        1 + Math.floor(Math.random() * 6)
      );
    });

    const finalCharacters = new Map<number, string>();

    encodedPositions.forEach((index) => {
      finalCharacters.set(index, randomCharacter());
    });

    const interval = window.setInterval(() => {
      frame++;

      const nextText = letters
        .map((letter, index) => {
          const startFrame = startFrames.get(index);

          if (startFrame === undefined) {
            return letter;
          }

          if (frame < startFrame) {
            return letter;
          }

          if (frame < TOTAL_FRAMES) {
            return randomCharacter();
          }

          return finalCharacters.get(index) ?? letter;
        })
        .join("");

      setDisplay(nextText);

      if (frame >= TOTAL_FRAMES) {
        window.clearInterval(interval);
      }
    }, FRAME_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [active, name, reducedMotion]);

  const visibleText =
    active && !reducedMotion ? display : name;

  return (
    <span aria-label={name}>
      <span aria-hidden="true">{visibleText}</span>
    </span>
  );
}

/* -----------------------------------------
   PROJECT ROW
----------------------------------------- */

type ProjectRowProps = {
  item: WorkProject;
};

function ProjectRow({ item }: ProjectRowProps) {
  const [active, setActive] = useState(false);

  const projectUrl = `/${item.slug}`;

  return (
    <Link
      href={projectUrl}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="
        group
        grid
        min-h-[112px]
        grid-cols-[26px_minmax(0,1fr)_22px]
        items-center
        gap-2.5
        border-t-[2.5px]
        border-[var(--lab-line)]
        bg-[#08090a]
        p-4
        text-[#e8e8e5]
        transition-none
        hover:bg-accent
        hover:text-white
        focus-visible:bg-accent
        focus-visible:text-white

        min-[701px]:min-h-[145px]
        min-[701px]:grid-cols-[55px_minmax(0,1fr)_115px_30px]
        min-[701px]:gap-[22px]
        min-[701px]:px-[26px]
        min-[701px]:py-5

        max-[950px]:min-[701px]:grid-cols-[40px_minmax(0,1fr)_85px_22px]
        max-[950px]:min-[701px]:gap-3
      "
    >
      {/* Project number */}
      <span
        className="
          self-start
          font-technical
          text-[11px]
          tracking-[0.07em]
          text-[#c0c2c3]
          group-hover:text-white
          group-focus-visible:text-white
        "
      >
        {item.id}
      </span>

      {/* Project title and description */}
      <div className="min-w-0">
        <h3
          className="
            text-[clamp(26px,8vw,44px)]
            leading-none
            tracking-[-0.05em]
            min-[701px]:text-[clamp(27px,4vw,55px)]
          "
          style={phosphorGlow}
        >
          <AsciiTitle
            key={`${item.slug}-${active}`}
            name={item.name}
            active={active}
          />
        </h3>

        <span
          className="
            mt-3
            block
            font-technical
            text-[12px]
            tracking-[0.045em]
            text-[#c0c2c3]
            group-hover:text-white
            group-focus-visible:text-white
          "
        >
          {item.description}
        </span>
      </div>

      {/* Project mark */}
      <div
        aria-hidden="true"
        className="
          relative
          hidden
          h-[88px]
          place-items-center
          overflow-hidden
          border
          border-[var(--lab-line)]
          bg-[#111315]

          group-hover:border-[#08090a]
          group-hover:bg-[#08090a]

          group-focus-visible:border-[#08090a]
          group-focus-visible:bg-[#08090a]

          min-[701px]:grid
          max-[950px]:h-[75px]
        "
      >
        <span
          className="
            text-[38px]
            font-bold
            tracking-[-0.1em]
            text-accent
            group-hover:text-white
            group-focus-visible:text-white
          "
        >
          {item.mark}
        </span>

        <i
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[repeating-linear-gradient(0deg,transparent,transparent_5px,#ffffff08_6px)]
          "
        />
      </div>

      {/* Arrow */}
      <ArrowUpRight
        size={23}
        aria-hidden="true"
        className="justify-self-end"
      />
    </Link>
  );
}

/* -----------------------------------------
   WORK SECTION
----------------------------------------- */

export default function Work() {
  const firstProject = work[0]?.id ?? "00";
  const lastProject = work[work.length - 1]?.id ?? "00";

  return (
    <section className="lab-section" id="work">
      <SectionTitle
        number="03"
        title="SELECTED WORK"
        note=""
      />

      <div
        className="
          border-[2.5px]
          border-[var(--lab-line)]
        "
      >
        {/* Section header */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            bg-[#111315]
            px-4
            py-[18px]
            font-technical
            text-[10px]
            tracking-[0.07em]
            text-[#929497]
            min-[701px]:px-6
          "
        >
          <span>INDEX / PROJECTS</span>

          <span className="text-accent">
            [ {firstProject} — {lastProject} ]
          </span>
        </div>

        {/* Project rows */}
        {work.map((item) => (
          <ProjectRow key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
