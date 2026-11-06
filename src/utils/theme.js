import { LOGO_PATHS, LOGO_VIEW_BOX } from "./logo-paths";

const STORAGE_KEY = "theme_color";

export const DEFAULT_THEME = "#89cff0";

export const THEME_PRESETS = [
  { name: "Baby Blue", value: "#89cff0" },
  { name: "Hitam", value: "#141416" },
  { name: "Merah", value: "#ff0000" },
  { name: "Violet", value: "#a43cff" },
  { name: "Biru", value: "#2f6bff" },
  { name: "Teal", value: "#00a389" },
  { name: "Oranye", value: "#ff6a00" },
  { name: "Pink", value: "#f0359a" },
];

const isValidColor = (value) => /^#[0-9a-f]{6}$/i.test(value ?? "");

const getLuminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;

    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const readStoredTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const getTheme = () => {
  const stored = readStoredTheme();

  return isValidColor(stored) ? stored : DEFAULT_THEME;
};

const mixWithInk = (hex, amount) => {
  const ink = [0x14, 0x14, 0x16];
  const channels = [1, 3, 5].map((start, index) =>
    Math.round(
      parseInt(hex.slice(start, start + 2), 16) * amount +
        ink[index] * (1 - amount),
    ),
  );

  return `rgb(${channels.join(",")})`;
};

// Favicon tidak bisa membaca variabel CSS halaman, jadi warnanya dihitung di sini
// dengan rumus yang sama seperti --logo-* di index.css.
const applyFavicon = (color) => {
  const link = document.getElementById("theme-favicon");

  if (!link) return;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEW_BOX}"><g fill-rule="evenodd"><path fill="${mixWithInk(color, 0.7)}" d="${LOGO_PATHS.main}"/><path fill="${mixWithInk(color, 0.35)}" d="${LOGO_PATHS.deep}"/><path fill="${color}" d="${LOGO_PATHS.accent}"/></g></svg>`;

  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const applyTheme = (color) => {
  const root = document.documentElement;

  root.style.setProperty("--brand", color);
  root.style.setProperty(
    "--brand-on",
    getLuminance(color) > 0.4 ? "#141416" : "#ffffff",
  );

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", color);

  applyFavicon(color);
};

export const saveTheme = (color) => {
  if (!isValidColor(color)) return;

  applyTheme(color);

  try {
    localStorage.setItem(STORAGE_KEY, color);
  } catch {
    // Tema tetap berlaku untuk sesi ini jika penyimpanan tidak tersedia.
  }
};
