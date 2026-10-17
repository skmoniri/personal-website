import { ArrowDownRight, Crosshair } from "lucide-react";
import ActionButton from "../ui/ActionButton";
import AsciiPortrait from "../AsciiPortrait";

const technical =
  "font-technical text-[10px] leading-[1.5] tracking-[0.09em] text-[#a5a8a9] sm:text-xs";

const divider = "border-[var(--lab-line)]";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={`w-full border-b-[2.5px] ${divider}`}
    >
      {/* Top document rail */}
      <div
        className={`flex min-h-12 items-center justify-between gap-3 border-b-[2.5px] px-4 py-3 sm:px-6 lg:px-10 ${divider}`}
      >
        <div className={`flex items-center gap-2 ${technical}`}>
          <span
            className="size-1.5 shrink-0 rounded-full bg-accent"
            aria-hidden="true"
          />
          <span>KAMYAR MONIRI / PORTFOLIO</span>
        </div>

        <span className={technical}>SYS.2026</span>
      </div>

      {/* Main composition */}
      <div className="grid min-w-0 grid-cols-1 lg:min-h-[min(76dvh,780px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Editorial introduction */}
        <div className="flex min-w-0 flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-[clamp(24px,4vw,72px)] lg:py-24">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-7 bg-accent" />
            <span className={`${technical} text-accent`}>
              01 / INTRODUCTION
            </span>
          </div>

          <h1
            id="hero-title"
            className="flex flex-col font-display text-[clamp(2.65rem,7vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.075em] max-[400px]:text-[clamp(2.45rem,10.8vw,3.2rem)]"
          >
            <span>FRONTEND</span>

            <span className="text-transparent [-webkit-text-stroke:1.5px_#d71920] sm:[-webkit-text-stroke:2px_#d71920]">
              DEVELOPER
              <span className="text-accent [-webkit-text-stroke:0]">.</span>
            </span>
          </h1>

          <div className="mt-8 max-w-[430px] border-l-2 border-accent/70 pl-4 sm:mt-10 sm:pl-5">
            <p className="text-[15px] leading-[1.65] text-[#b5b6b4] sm:text-[17px]">
              I build distinctive digital experiences through design,
              interaction, and frontend development.
            </p>
          </div>

          <div className="mt-9 flex flex-col items-start gap-4 sm:mt-11">
            <ActionButton
              mode="border"
              label="EXPLORE SELECTED WORK"
              href="#work"
            />

            <span className={`${technical} pl-1`}>
              INDEX / SELECTED PROJECTS
            </span>
          </div>

          <div className="mt-14 hidden items-center gap-3 lg:flex">
            <span className="h-px w-8 bg-[var(--lab-line)]" />
            <span className={technical}>DESIGN / CODE / SYSTEMS</span>
          </div>
        </div>

        {/* ASCII portrait artifact */}
        <div
          className={`flex min-w-0 flex-col border-t-[2.5px] lg:border-t-0 lg:border-l-[2.5px] ${divider}`}
        >
          {/* Artifact header */}
          <div
            className={`flex items-center justify-between gap-3 border-b-[2.5px] px-4 py-3 sm:px-6 ${divider}`}
          >
            <span className={technical}>KM_001.ASC</span>

            <span
              className={`${technical} flex items-center gap-2 text-accent`}
            >
              <span
                className="size-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              SIGNAL ACTIVE
            </span>
          </div>

          {/* ASCII stage */}
          <div
            data-cursor="artifact"
            className="relative flex min-h-[280px] flex-1 items-center justify-center overflow-hidden bg-[var(--lab-bg)] px-3 py-12 sm:min-h-[360px] sm:px-5 lg:min-h-[430px]"
          >
            {/* Portrait fills the available stage without resizing it */}
            <div className="absolute inset-0 z-10 overflow-hidden">
              {" "}
              <AsciiPortrait />
            </div>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-5 left-5 z-20 font-mono text-lg text-accent"
            >
              +
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-5 bottom-5 z-20 font-mono text-lg text-accent"
            >
              +
            </span>

            <Crosshair
              size={19}
              strokeWidth={1.5}
              aria-hidden="true"
              className="pointer-events-none absolute top-5 right-5 z-20 text-accent"
            />

            {/* Index */}
            <span
              className={`${technical} pointer-events-none absolute bottom-5 left-5 z-20`}
            >
              FIG.001
            </span>
          </div>

          {/* Artifact footer */}
          <div
            className={`flex items-center justify-between gap-3 border-t-[2.5px] px-4 py-3 sm:px-6 ${divider}`}
          >
            <span className={technical}>PERSONAL IDENTITY ARTIFACT</span>

            <span className={`${technical} text-accent`}>KM / 26</span>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t-[2.5px] px-4 py-3 sm:px-6 lg:px-10 ${divider}`}
      >
        <span className={technical}>DESIGN / DEVELOPMENT / INTERACTION</span>

        <a
          href="#work"
          className="group inline-flex min-h-10 items-center gap-2 font-technical text-[10px] tracking-[0.08em] transition-colors duration-200 hover:text-accent focus-visible:text-accent sm:text-xs"
        >
          SCROLL TO EXPLORE
          <ArrowDownRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transition-none"
          />
        </a>
      </div>
    </section>
  );
}
