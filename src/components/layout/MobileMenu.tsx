
"use client";

import { ArrowUpRight } from "lucide-react";

type MobileMenuProps = {
  menuOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ menuOpen, onClose }: MobileMenuProps) {
  if (!menuOpen) return null;

  return (
    <nav
      className="lab-mobile-panel"
      id="lab-mobile-navigation"
      aria-label="Mobile navigation"
    >
      <p>
        &gt; NAVIGATION DIRECTORY
        <br />
        &gt; SELECT DESTINATION_
      </p>

      {(
        [
          ["01", "HOME", "/#hero"],
          ["02", "WORK", "/#work"],
          ["03", "ABOUT", "/#about"],
          ["04", "SERVICES", "/#services"],
          ["05", "CONTACT", "/#contact"],
        ] as const
      ).map(([id, label, href]) => (
        <a key={id} href={href} onClick={onClose}>
          <small>{id}</small>
          <strong>{label}</strong>
          <ArrowUpRight size={18} />
        </a>
      ))}

      <div className="lab-mobile-panel-end">
        SYS / ONLINE <span>END OF INDEX</span>
      </div>
    </nav>
  );
}
