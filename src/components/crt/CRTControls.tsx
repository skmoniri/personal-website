"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Minus, Plus } from "lucide-react";
import type { CrtSettings } from "../../types/crt";

export default function CRTControls({

  settings,

  setSettings,

}: {

  settings: CrtSettings;

  setSettings: Dispatch<SetStateAction<CrtSettings>>;

}) {

  const [open, setOpen] = useState(false);

  const update = (key: keyof CrtSettings, value: number | boolean) =>

    setSettings((previous) => ({ ...previous, [key]: value }));

  return (

    <aside

      className={`lab-crt-controls ${open ? "is-open" : ""}`}

      aria-label="CRT display settings"

    >

      <button

        type="button"

        className="lab-crt-toggle"

        onClick={() => setOpen(!open)}

        aria-expanded={open}

        aria-controls="lab-crt-options"

      >

        <span className="lab-status-dot" /> CRT / DISPLAY{" "}

        {open ? <Minus size={15} /> : <Plus size={15} />}

      </button>

      {open && (

        <div id="lab-crt-options" className="lab-crt-options">

          <div className="lab-crt-controls-title">

            <strong>DISPLAY CALIBRATION</strong>

            <button

              type="button"

              onClick={() =>

                setSettings({ enabled: true, curve: 30, lines: 80 })

              }

            >

              RESET

            </button>

          </div>

          <label className="lab-crt-checkbox">

            <input

              type="checkbox"

              checked={settings.enabled}

              onChange={(e) => update("enabled", e.target.checked)}

            />{" "}

            ENABLE CRT OVERLAY

          </label>

          {(

            [

              ["curve", "CURVED GLASS"],

              ["lines", "SCANLINES"],

            ] as const

          ).map(([key, label]) => (

            <label className="lab-crt-slider" key={key}>

              <span>

                {label} <b>{settings[key]}%</b>

              </span>

              <input

                type="range"

                min="0"

                max="100"

                value={settings[key]}

                onChange={(e) => update(key, Number(e.target.value))}

                disabled={!settings.enabled}

              />

            </label>

          ))}

          <p>

            Experimental CRT displacement. Small text may appear softer near the

            edges.

          </p>

        </div>

      )}

    </aside>

  );

}
