"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const DIRECTION_THRESHOLD = 7;

export default function MainNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // The CRT viewport is the scroll container, not window.
    const viewport = headerRef.current?.closest<HTMLElement>(".lab-viewport");
    if (!viewport) return;

    let previous = viewport.scrollTop;
    let accumulated = 0;
    let previousDirection = 0;

    const onScroll = () => {
      const current = Math.max(0, viewport.scrollTop);
      const delta = current - previous;
      previous = current;

      // Always show the header at the top.
      if (current <= 12) {
        setHidden(false);
        accumulated = 0;
        previousDirection = 0;
        return;
      }

      // Keep the header visible while the menu is open.
      if (menuOpen) {
        return;
      }

      if (Math.abs(delta) < 0.5) return;

      const direction = Math.sign(delta);

      accumulated =
        direction === previousDirection ? accumulated + delta : delta;

      previousDirection = direction;

      // Scrolling down: hide.
      if (accumulated > DIRECTION_THRESHOLD) {
        setHidden(true);
        accumulated = 0;
      }

      // Scrolling up: show.
      else if (accumulated < -DIRECTION_THRESHOLD) {
        setHidden(false);
        accumulated = 0;
      }
    };

    viewport.addEventListener("scroll", onScroll, { passive: true });

    return () => viewport.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((previous) => !previous);
    setHidden(false);
  };

  return (
    <header
      ref={headerRef}
      className={`lab-header lab-header--sticky${
        hidden && !menuOpen ? " lab-header--hidden" : ""
      }`}
    >
      <div className="lab-nav-row">
        <Link className="lab-brand" href="/#top">
          KAMYAR MONIRI<span>.</span>
        </Link>

        <nav className="lab-desktop-links" aria-label="Main navigation">
          <Link href="/#hero">HOME</Link>
          <Link href="/#work">WORK</Link>
          <Link href="/#about">ABOUT</Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>

        <Link className="lab-nav-contact" href="/#contact">
          LET&apos;S TALK <ArrowUpRight size={16} />
        </Link>

        <button
          className="lab-mobile-toggle"
          type="button"
          aria-controls="lab-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={toggleMenu}
        >
          {menuOpen ? "[ CLOSE ]" : "[ MENU ]"}
        </button>
      </div>

      <div className="lab-mobile-meta">
        <span>FRONTEND DEVELOPER</span>
        <span>SYS.26</span>
      </div>

      <MobileMenu menuOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
