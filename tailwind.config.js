/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#CCD67F",
        primaryDark: "#B7C45E",

        secondary: "#8A5F41",
        secondaryLight: "#A77F60",

        beige: "#F3E4C9",

        background: "#FAFAF8",
        surface: "#FFFFFF",

        dark: {
          background: "#161A14",
          surface: "#1F241C",
          card: "#262D22",
        },
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
