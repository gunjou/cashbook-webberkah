/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",

        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",

        beige: "var(--beige)",

        background: "var(--background)",
        surface: "var(--surface)",
        card: "var(--card)",

        text: "var(--text)",
        muted: "var(--muted)",

        border: "var(--border)",
      },

      borderRadius: {
        DEFAULT: "10px",
        lg: "16px",
        xl: "20px",
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
