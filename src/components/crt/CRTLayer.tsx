import type { CSSProperties } from "react";
import type { CrtSettings } from "../../types/crt";

export default function CRTLayer({ settings }: { settings: CrtSettings }) {
  if (!settings.enabled) return null;

  const style = {
    "--crt-curve": `${settings.curve / 100}`,
    "--crt-lines": `${settings.lines / 100}`,
    "--crt-radius": `${settings.curve * 0.35}px`,
    "--crt-glow": `${settings.curve * 1.1}px`,
    "--crt-inset": `${settings.curve * 0.08}px`,
    "--crt-glass-shadow": `${settings.curve * 0.25}px`,
    "--crt-border": `${settings.curve * 0.04}px`,
  } as CSSProperties;

  return (
    <div className="lab-crt" aria-hidden="true" style={style}>
      <div className="lab-crt-vignette" />
      <div className="lab-crt-depth" />
      <div className="lab-crt-scanlines" />
      <div className="lab-crt-noise" />
      <div className="lab-crt-glass" />
      <div className="lab-crt-edge-light" />
      <div className="lab-crt-chromatic" />
    </div>
  );
}
