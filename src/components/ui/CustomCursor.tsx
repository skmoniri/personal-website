"use client";

import { useEffect, useRef } from "react";

type CursorMode = "default" | "interactive" | "artifact";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "summary",
  "label[for]",
  "select",
  "[data-cursor='interactive']",
].join(",");

const TEXT_SELECTOR = [
  "input",
  "textarea",
  "[contenteditable='true']",
  "[data-cursor='text']",
].join(",");

const ARTIFACT_SELECTOR = "[data-cursor='artifact']";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const shell = shellRef.current;
    const label = labelRef.current;

    if (!cursor || !shell || !label) return;

    const pointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );

    let enabled = false;
    let visible = false;
    let pressed = false;
    let isText = false;
    let mode: CursorMode = "default";

    let currentTarget: EventTarget | null = null;

    const setVisible = (next: boolean) => {
      if (visible === next) return;

      visible = next;
      cursor.style.opacity = next ? "1" : "0";
    };

    const updateAppearance = () => {
      label.textContent = pressed
        ? "▓"
        : mode === "interactive"
          ? ">█"
          : mode === "artifact"
            ? "01█"
            : "█";

      shell.className = [
        "font-mono text-[14px] leading-none",
        "tracking-[-0.08em] text-accent",
        mode === "default"
          ? "px-0 py-0"
          : "border border-accent/35 bg-background/85 px-1.5 py-0.5",
        pressed ? "scale-y-90 opacity-90" : "scale-100 opacity-100",
      ].join(" ");
    };

    const setPressed = (next: boolean) => {
      if (pressed === next) return;

      pressed = next;
      updateAppearance();
    };

    const resolveTarget = (target: EventTarget | null) => {
      if (currentTarget === target) return;

      currentTarget = target;

      const element = target instanceof Element ? target : null;

      const nextIsText = Boolean(element?.closest(TEXT_SELECTOR));

      if (isText !== nextIsText) {
        isText = nextIsText;

        document.body.classList.toggle("km-cursor-text", isText);
      }

      if (isText) {
        setVisible(false);
        return;
      }

      let nextMode: CursorMode = "default";

      if (element?.closest(ARTIFACT_SELECTOR)) {
        nextMode = "artifact";
      } else if (element?.closest(INTERACTIVE_SELECTOR)) {
        nextMode = "interactive";
      }

      if (mode !== nextMode) {
        mode = nextMode;
        updateAppearance();
      }
    };

    const updatePosition = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const handleMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      updatePosition(event);
      resolveTarget(event.target);

      if (!isText) {
        setVisible(true);
      }
    };

    const handleRawMove = (event: PointerEvent) => {
      updatePosition(event);
    };

    const handleOver = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      updatePosition(event);
      resolveTarget(event.target);

      if (!isText) {
        setVisible(true);
      }
    };

    const handleDown = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      setPressed(true);
    };

    const handleUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      setPressed(false);
    };

    const resetCursor = () => {
      setVisible(false);
      setPressed(false);

      currentTarget = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetCursor();
      }
    };

    const updateAvailability = () => {
      enabled = pointerQuery.matches;

      document.body.classList.toggle("km-cursor-enabled", enabled);

      if (!enabled) {
        resetCursor();

        isText = false;
        mode = "default";

        document.body.classList.remove("km-cursor-text");

        updateAppearance();
      }
    };

    updateAppearance();
    updateAvailability();

    pointerQuery.addEventListener("change", updateAvailability);

    // Primary pointer tracking.
    document.addEventListener("pointermove", handleMove, { passive: true });

    // More immediate pointer updates where supported.
    if ("onpointerrawupdate" in window) {
      document.addEventListener(
        "pointerrawupdate",
        handleRawMove as EventListener,
        { passive: true },
      );
    }

    document.addEventListener("pointerover", handleOver, { passive: true });

    window.addEventListener("pointerdown", handleDown);

    window.addEventListener("pointerup", handleUp);

    window.addEventListener("pointercancel", resetCursor);

    document.addEventListener("mouseleave", resetCursor);

    window.addEventListener("blur", resetCursor);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      pointerQuery.removeEventListener("change", updateAvailability);

      document.removeEventListener("pointermove", handleMove);

      document.removeEventListener(
        "pointerrawupdate",
        handleRawMove as EventListener,
      );

      document.removeEventListener("pointerover", handleOver);

      window.removeEventListener("pointerdown", handleDown);

      window.removeEventListener("pointerup", handleUp);

      window.removeEventListener("pointercancel", resetCursor);

      document.removeEventListener("mouseleave", resetCursor);

      window.removeEventListener("blur", resetCursor);

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      document.body.classList.remove("km-cursor-enabled", "km-cursor-text");
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="
        pointer-events-none
        fixed left-0 top-0
        z-[9999]
        hidden
        opacity-0
        will-change-transform
        min-[768px]:block
      "
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div ref={shellRef}>
          <span ref={labelRef}>█</span>
        </div>
      </div>
    </div>
  );
}
