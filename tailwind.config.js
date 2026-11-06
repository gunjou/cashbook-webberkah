/** @type {import('tailwindcss').Config} */
const token = (name) =>
  `color-mix(in srgb, var(${name}) calc(<alpha-value> * 100%), transparent)`;

module.exports = {
  // Mode gelap sudah dihapus; "class" mencegah varian dark: mengikuti OS.
  darkMode: "class",

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: token("--brand"),
          50: token("--primary-50"),
          100: token("--primary-100"),
          200: token("--primary-200"),
          300: token("--primary-300"),
          400: token("--primary-400"),
          500: token("--primary-500"),
          600: token("--brand"),
          700: token("--primary-700"),
          800: token("--primary-800"),
          900: token("--primary-900"),
        },
        "primary-strong": token("--primary-strong"),
        ink: "rgb(20 20 22 / <alpha-value>)",

      },

      // Warna tema terang tidak terbaca sebagai teks di atas latar terang.
      textColor: {
        primary: token("--primary-strong"),
      },

      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          "sans-serif",
        ],
      },

      spacing: {
        13: "3.25rem",
      },

      opacity: {
        6: "0.06",
        8: "0.08",
      },

      borderRadius: {
        DEFAULT: "10px",
        lg: "16px",
        xl: "20px",
        card: "1.75rem",
      },

      keyframes: {
        "chevron-walk": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "notify-fade": { from: { opacity: "0" }, to: { opacity: "1" } },
        "notify-pop": {
          from: { opacity: "0", transform: "scale(1.08)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "notify-drop": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },

      animation: {
        "chevron-walk": "chevron-walk 1.4s ease-in-out infinite",
        "notify-fade": "notify-fade 0.18s ease-out",
        "notify-pop": "notify-pop 0.22s cubic-bezier(0.32, 0.72, 0, 1)",
        "notify-drop": "notify-drop 0.28s cubic-bezier(0.32, 0.72, 0, 1)",
      },

      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,.06)",
        card: "0 4px 12px rgba(0,0,0,.08)",
        modal: "0 10px 30px rgba(0,0,0,.12)",
      },
    },
  },

  plugins: [],
};
