import { useState } from "react";
import { Check } from "lucide-react";

import Button from "./Button";
import Dialog from "./Dialog";
import { getTheme, saveTheme, THEME_PRESETS } from "../utils/theme";

const ThemePicker = ({ open, onClose }) => {
  const [color, setColor] = useState(getTheme);

  const handleSelect = (value) => {
    setColor(value);
    saveTheme(value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      zIndex={60}
      aria-labelledby="theme-picker-title"
      className="max-w-sm p-6"
    >
      <h2 id="theme-picker-title" className="text-lg font-semibold text-ink">
        Warna Tema
      </h2>

      <p className="mt-1 text-sm text-neutral-600">
        Warna tersimpan di browser ini.
      </p>

      <div className="mt-5 grid grid-cols-4 gap-3">
        {THEME_PRESETS.map((preset) => {
          const active = preset.value === color;

          return (
            <button
              key={preset.value}
              type="button"
              aria-label={preset.name}
              aria-pressed={active}
              title={preset.name}
              onClick={() => handleSelect(preset.value)}
              style={{ backgroundColor: preset.value }}
              className="mx-auto flex size-11 items-center justify-center rounded-full ring-1 ring-ink/10 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 active:scale-95"
            >
              {active && (
                <Check
                  aria-hidden="true"
                  strokeWidth={2}
                  className="size-5 text-white drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.7)]"
                />
              )}
            </button>
          );
        })}
      </div>

      <label className="mt-5 flex h-12 cursor-pointer items-center justify-between rounded-2xl px-4 text-sm font-medium text-ink glass-inset">
        Warna lain
        <input
          type="color"
          value={color}
          onChange={(event) => handleSelect(event.target.value)}
          className="size-8 cursor-pointer rounded-full border-0 bg-transparent p-0"
        />
      </label>

      <Button variant="light" onClick={onClose} className="mt-5 w-full">
        Tutup
      </Button>
    </Dialog>
  );
};

export default ThemePicker;
