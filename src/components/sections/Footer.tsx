import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import ActionButton from "../ui/ActionButton";

const secondaryContacts = [
  {
    label: "GITHUB",
    href: "https://github.com/skmoniri",
  },
  {
    label: "LINKEDIN",
    href: "https://linkedin.com/in/kamyar-moniri",
  },
];

const technical = "font-technical text-[10px] leading-[1.5] tracking-[0.075em]";

const muted = "text-[#a5a8a9]";
const line = "border-[var(--lab-line)]";

const kamyarGlow = {
  textShadow: `
    0 0 5px rgba(232, 232, 229, 0.45),
    0 0 15px rgba(232, 232, 229, 0.25),
    0 0 35px rgba(232, 232, 229, 0.12),
    0 0 65px rgba(232, 232, 229, 0.05)
  `,
};

const moniriOutline = {
  color: "transparent",
  WebkitTextFillColor: "transparent",
  WebkitTextStroke: "1.5px #d71920",
  textShadow: "none",
  filter: "none",
};

const redDot = {
  color: "#d71920",
  WebkitTextFillColor: "#d71920",
  WebkitTextStroke: "0px",
  textShadow: "none",
  filter: "none",
};

export default function Footer() {
  return (
    <footer
      id="contact"
      className={`w-full border-[2.5px] bg-[#08090a] text-[#e8e8e5] ${line}`}
    >
      {/* Top rail */}
      <div
        className={`flex items-center justify-between gap-3 border-b-[2.5px] px-5 py-3 md:px-8 ${line} ${technical} ${muted}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-accent" />

          <span>KM / DIGITAL ARCHIVE</span>
        </div>

        <span>04 / END OF DOCUMENT</span>
      </div>

      {/* Main identity */}
      <div className="px-5 pb-6 pt-7 md:px-8 md:pb-8 md:pt-9">
        <div
          className={`mb-5 flex flex-wrap justify-between gap-2 ${technical} ${muted}`}
        >
          <span>INDEPENDENT FRONTEND DEVELOPER</span>

          <span>DESIGN / CODE / INTERACTION</span>
        </div>

        <h2 className="whitespace-nowrap font-display text-[clamp(2.1rem,9.7vw,10rem)] font-bold leading-[0.9] tracking-[-0.085em]">
          <span style={kamyarGlow}>KAMYAR</span>{" "}
          <span style={moniriOutline}>MONIRI</span>
          <span style={redDot}>.</span>
        </h2>
      </div>

      {/* Compact contact section */}
      <div className={`border-t-[2.5px] ${line}`}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left */}
          <div
            className={`flex min-w-0 flex-col justify-between border-b-[2.5px] px-5 py-6 md:px-8 md:py-7 lg:border-b-0 lg:border-r-[2.5px] ${line}`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-1.5 w-1.5 bg-accent" />

              <span className={`${technical} text-accent`}>
                04 / GET IN TOUCH
              </span>
            </div>

            <h3 className="font-display text-[clamp(2.4rem,4.5vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.07em]">
              <span className="block" style={kamyarGlow}>
                LET&apos;S BUILD
              </span>

              <span className="block">
                <span style={kamyarGlow}>WHAT&apos;S </span>

                <span style={moniriOutline}>NEXT</span>
                <span style={redDot}>.</span>
              </span>
            </h3>

            <span className={`mt-5 ${technical} ${muted}`}>
              DIRECT COMMUNICATION / OPEN CHANNEL
            </span>
          </div>

          {/* Right */}
          <div className="flex min-w-0 flex-col px-5 py-6 md:px-8 md:py-7">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className={`${technical} text-accent`}>
                  PRIMARY CONTACT
                </span>

                <span className={`${technical} ${muted}`}>[ EMAIL ]</span>
              </div>

              {/* Email — instant hover */}
              <a
                href="mailto:skmoniri83@gmail.com"
                className="group inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 border-b border-transparent pb-1 hover:border-accent focus-visible:border-accent focus-visible:outline-none"
              >
                <span className="break-all font-display text-[clamp(1.7rem,3.1vw,3.7rem)] font-bold leading-[1.05] tracking-[-0.055em] text-[#e8e8e5] group-hover:text-accent group-focus-visible:text-accent">
                  skmoniri83@gmail.com
                </span>

                <ArrowUpRight
                  size={25}
                  strokeWidth={1.5}
                  className="shrink-0 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
                />
              </a>

              {/* Phone — instant hover */}
              <div className="mt-4">
                <a
                  href="tel:+989102330135"
                  className="group inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 border-b border-transparent pb-1 hover:border-accent focus-visible:border-accent focus-visible:outline-none"
                >
                  <span className="font-display text-[clamp(1.45rem,2.3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.045em] text-[#e8e8e5] group-hover:text-accent group-focus-visible:text-accent">
                    +98 910 233 0135
                  </span>

                  <ArrowUpRight
                    size={23}
                    strokeWidth={1.5}
                    className="shrink-0 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
                  />
                </a>
              </div>
            </div>

            {/* Social buttons — Hero Corner Lock style */}
            <div className="mt-6 border-t border-[var(--lab-line)] pt-5 lg:mt-auto">
              <div className="grid grid-cols-2 gap-2">
                {secondaryContacts.map((contact) => (
                  <ActionButton
                    key={contact.label}
                    mode="border"
                    label={contact.label}
                    href={contact.href}
                    external
                    fullWidth
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom rail */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-t-[2.5px] px-5 py-3 md:px-8 ${line} ${technical} ${muted}`}
      >
        <span>© 2026 / KAMYAR MONIRI</span>

        <span className="hidden items-center gap-2 md:inline-flex">
          <span className="size-1.5 rounded-full bg-accent" />
          SYSTEM ONLINE / SYS.26
        </span>

        <Link
          href="/#hero"
          className="group inline-flex min-h-8 items-center gap-2 text-[#e8e8e5] transition-colors duration-200 hover:text-accent"
        >
          BACK TO TOP
          <ArrowUp
            size={14}
            className="transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transform-none"
          />
        </Link>
      </div>
    </footer>
  );
}
