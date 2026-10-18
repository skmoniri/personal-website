"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Crosshair,
  MousePointer2,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";

/* -----------------------------------------
   CONFIGURATION
----------------------------------------- */

type Service = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  details: string;
  deliverables: string[];
  icon: LucideIcon;
};

const services: Service[] = [
  {
    id: "development",
    number: "01",
    title: "WEB DEVELOPMENT",
    category: "ENGINEERING / IMPLEMENTATION",
    description:
      "Custom websites and web applications built for performance and maintainability.",
    details:
      "From interface architecture to production-ready implementation, I build responsive digital experiences using modern technologies and practical engineering decisions.",
    deliverables: [
      "CUSTOM WEBSITES",
      "RESPONSIVE DEVELOPMENT",
      "REACT / NEXT.JS",
      "API INTEGRATION",
      "PERFORMANCE OPTIMIZATION",
    ],
    icon: Code2,
  },
  {
    id: "creative",
    number: "02",
    title: "CREATIVE DEVELOPMENT",
    category: "DESIGN / INTERACTION",
    description:
      "Distinctive interfaces built through design, motion, and interaction.",
    details:
      "Custom interactions, animation systems, and visual details that give digital experiences a recognizable identity without sacrificing usability.",
    deliverables: [
      "INTERACTIVE INTERFACES",
      "MOTION / ANIMATION",
      "MICRO-INTERACTIONS",
      "RESPONSIVE EXPERIENCES",
      "CUSTOM UI SYSTEMS",
    ],
    icon: MousePointer2,
  },
  {
    id: "infrastructure",
    number: "03",
    title: "DEPLOYMENT & SETUP",
    category: "INFRASTRUCTURE / DELIVERY",
    description:
      "Production environments, hosting configuration, and website launches.",
    details:
      "Preparing the technical environment for a reliable launch, including domain configuration, hosting setup, SSL, production deployment, and verification.",
    deliverables: [
      "DOMAIN CONFIGURATION",
      "HOSTING SETUP",
      "SSL CONFIGURATION",
      "PRODUCTION DEPLOYMENT",
      "LAUNCH VERIFICATION",
    ],
    icon: Server,
  },
  {
    id: "maintenance",
    number: "04",
    title: "MAINTENANCE & SUPPORT",
    category: "OPERATIONS / CONTINUITY",
    description:
      "Technical support, updates, troubleshooting, and ongoing improvements.",
    details:
      "Support does not have to end at launch. I can handle technical updates, bug fixes, performance improvements, and changes as a website continues to evolve.",
    deliverables: [
      "BUG FIXES",
      "DEPENDENCY UPDATES",
      "PERFORMANCE IMPROVEMENTS",
      "CONTENT / FEATURE UPDATES",
      "TECHNICAL TROUBLESHOOTING",
    ],
    icon: Wrench,
  },
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
};

const technical =
  "font-technical text-[10px] leading-[1.5] tracking-[0.09em] text-[#929497] sm:text-xs";

/* -----------------------------------------
   SERVICE DETAILS
----------------------------------------- */

function ServiceDetails({
  service,
  mobile = false,
}: {
  service: Service;
  mobile?: boolean;
}) {
  const Icon = service.icon;

  return (
    <div
      id={
        mobile ? `service-mobile-panel-${service.id}` : "service-desktop-panel"
      }
      className="flex h-full min-w-0 flex-col bg-[#0b0c0d]"
    >
      {/* Panel header */}
      <div className="flex min-h-[42px] items-center justify-between gap-3 border-b border-[var(--lab-line)] bg-[#111315] px-4 py-2">
        <span className={technical}>SERVICE_MODULE / {service.number}</span>

        <span className="flex items-center gap-2 font-technical text-[10px] tracking-[0.07em] text-accent">
          <span className="size-1.5 bg-accent" />[ ACTIVE ]
        </span>
      </div>

      {/* Panel content */}
      <div className="relative flex flex-1 flex-col overflow-hidden px-4 py-5 sm:px-5 sm:py-6">
        {/* Static scanlines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.035) 4px)",
          }}
        />

        <div className="relative z-10">
          {/* Status */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="font-technical text-[10px] tracking-[0.09em] text-accent">
              &gt; RECORD LOADED
            </span>

            <Icon
              size={19}
              strokeWidth={1.4}
              className="text-accent"
              aria-hidden="true"
            />
          </div>

          <span className="block font-technical text-[10px] tracking-[0.09em] text-[#777b7e]">
            {service.category}
          </span>

          {/* Service title */}
          <h3
            className="mt-3 font-display text-[clamp(1.65rem,2.8vw,2.75rem)] font-bold leading-[0.98] tracking-[-0.055em] text-[#e8e8e5]"
            style={phosphorGlow}
          >
            {service.title}
            <span className="text-accent">.</span>
          </h3>

          <p className="mt-3 max-w-[540px] text-[13px] leading-[1.6] text-[#bfc1c2] sm:text-[14px]">
            {service.details}
          </p>

          {/* Deliverables */}
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--lab-line)] pb-2.5">
              <span className="font-technical text-[10px] tracking-[0.08em] text-[#e8e8e5]">
                SCOPE / DELIVERABLES
              </span>

              <span className="font-technical text-[10px] text-[#777b7e]">
                [ {String(service.deliverables.length).padStart(2, "0")} ]
              </span>
            </div>

            <div>
              {service.deliverables.map((item, index) => (
                <div
                  key={item}
                  className="flex min-h-[32px] items-center gap-3 border-b border-[#292c2e] py-1.5"
                >
                  <span className="font-technical text-[10px] text-[#777b7e]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <Check
                    size={12}
                    strokeWidth={1.8}
                    className="shrink-0 text-accent"
                    aria-hidden="true"
                  />

                  <span className="font-technical text-[11px] tracking-[0.045em] text-[#c0c2c3]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-5 font-technical text-[10px] tracking-[0.07em] text-[#777b7e]">
          <span>KM / CAPABILITY RECORD</span>

          <Crosshair
            size={14}
            strokeWidth={1.4}
            className="text-accent"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------
   SERVICE SELECTOR
----------------------------------------- */

function ServiceButton({
  service,
  active,
  onSelect,
}: {
  service: Service;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-expanded={active}
      aria-controls={active ? `service-mobile-panel-${service.id}` : undefined}
      className={`
        group
        relative
        grid
        w-full
        min-w-0
        grid-cols-[26px_minmax(0,1fr)_20px]
        items-center
        gap-3
        px-4
        py-4
        text-left
        focus-visible:outline-2
        focus-visible:outline-offset-[-2px]
        focus-visible:outline-accent
        sm:px-5
        ${
          active
            ? "bg-accent text-white"
            : "bg-[#08090a] text-[#e8e8e5] hover:bg-accent hover:text-white"
        }
      `}
    >
      {/* Active marker */}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 top-0 w-[3px] ${
          active ? "bg-white" : "bg-transparent group-hover:bg-white"
        }`}
      />

      {/* Number */}
      <span
        className={`self-start pt-0.5 font-technical text-[11px] tracking-[0.08em] ${
          active ? "text-white" : "text-accent group-hover:text-white"
        }`}
      >
        {service.number}
      </span>

      {/* Text */}
      <div className="min-w-0">
        <span
          className={`mb-1.5 block font-technical text-[9px] tracking-[0.08em] sm:text-[10px] ${
            active
              ? "text-white/80"
              : "text-[#777b7e] group-hover:text-white/80"
          }`}
        >
          {service.category}
        </span>

        <span className="block font-display text-[clamp(1.15rem,1.8vw,1.65rem)] font-bold leading-[1.05] tracking-[-0.045em]">
          {service.title}
        </span>

        <span
          className={`mt-1.5 block max-w-[450px] text-[12px] leading-[1.45] ${
            active
              ? "text-white/85"
              : "text-[#929497] group-hover:text-white/85"
          }`}
        >
          {service.description}
        </span>
      </div>

      <Icon
        size={19}
        strokeWidth={1.4}
        aria-hidden="true"
        className={`justify-self-end ${
          active ? "text-white" : "text-[#777b7e] group-hover:text-white"
        }`}
      />
    </button>
  );
}

/* -----------------------------------------
   SERVICES SECTION
----------------------------------------- */

export default function Services() {
  const [activeId, setActiveId] = useState(services[0].id);

  const activeService =
    services.find((service) => service.id === activeId) ?? services[0];

  return (
    <section className="lab-section" id="services">
      <SectionTitle
        number="03"
        title="SERVICES"
        note="CAPABILITIES / DELIVERY"
      />

      {/* Compact editorial introduction */}
      <div className="grid grid-cols-1 items-end gap-5 border-b border-[var(--lab-line)] pb-5 pt-6 min-[701px]:grid-cols-[1.1fr_0.9fr] min-[701px]:gap-8">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-3">
            <span className="size-1.5 bg-accent" />

            <span className="font-technical text-[10px] tracking-[0.12em] text-[#929497]">
              DEVELOPMENT / DELIVERY / SUPPORT
            </span>
          </div>

          <h2 className="font-display text-[clamp(2.6rem,5.5vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.065em]">
            <span className="block text-[#e8e8e5]" style={phosphorGlow}>
              BEYOND
            </span>

            <span className="block" style={redOutline}>
              THE CODE<span style={redDot}>.</span>
            </span>
          </h2>
        </div>

        <div className="min-w-0 pb-1">
          <span className="mb-3 block h-px w-7 bg-accent" />

          <p className="max-w-[460px] text-[clamp(13px,1.15vw,15px)] leading-[1.55] text-[#bfc1c2]">
            I work across development, interaction, deployment, and the
            technical work that follows launch.
          </p>

          <p className="mt-2 max-w-[460px] text-[clamp(12px,1vw,14px)] leading-[1.5] text-[#8e9294]">
            From building the experience to preparing its production environment
            and supporting it over time.
          </p>
        </div>
      </div>

      {/* Registry label */}
      <div className="mb-3 mt-5 flex items-center justify-between gap-3">
        <span className="font-technical text-[11px] tracking-[0.09em] text-[#e8e8e5]">
          01 / SERVICE REGISTRY
        </span>

        <span className="font-technical text-[10px] tracking-[0.07em] text-[#777b7e]">
          [ 04 MODULES ]
        </span>
      </div>

      {/* Full-width registry */}
      <div className="grid w-full min-w-0 grid-cols-1 border-[2.5px] border-[var(--lab-line)] min-[901px]:grid-cols-2">
        {/* Left: services */}
        <div className="min-w-0 min-[901px]:border-r-[2.5px] min-[901px]:border-[var(--lab-line)]">
          <div className="flex min-h-[42px] items-center justify-between gap-3 border-b border-[var(--lab-line)] bg-[#111315] px-4 py-2">
            <span className={technical}>INDEX / AVAILABLE SERVICES</span>

            <span className="font-technical text-[10px] text-accent">
              [ 01 — 04 ]
            </span>
          </div>

          <div className="divide-y divide-[var(--lab-line)]">
            {services.map((service) => {
              const active = activeId === service.id;

              return (
                <div key={service.id}>
                  <ServiceButton
                    service={service}
                    active={active}
                    onSelect={() => setActiveId(service.id)}
                  />

                  {/* Mobile details */}
                  {active && (
                    <div className="min-[901px]:hidden">
                      <ServiceDetails service={service} mobile />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--lab-line)] bg-[#111315] px-4 py-2.5 font-technical text-[10px] tracking-[0.07em] text-[#777b7e] sm:px-5">
            <span>SELECT MODULE TO INSPECT</span>

            <span className="text-accent">{activeService.number} / 04</span>
          </div>
        </div>

        {/* Right: details, fills its entire column */}
        <div className="hidden min-w-0 min-[901px]:flex">
          <div className="w-full min-w-0">
            <ServiceDetails service={activeService} />
          </div>
        </div>
      </div>

      {/* Closing rail */}
      <div className="mt-4 flex flex-col gap-3 border-t border-[var(--lab-line)] pt-4 min-[701px]:flex-row min-[701px]:items-center min-[701px]:justify-between">
        <div className="flex items-center gap-3">
          <span className="size-1.5 bg-accent" />

          <span className="font-technical text-[10px] tracking-[0.09em] text-[#929497]">
            PROJECT SCOPE / DEFINED PER ENGAGEMENT
          </span>
        </div>
      </div>
    </section>
  );
}
