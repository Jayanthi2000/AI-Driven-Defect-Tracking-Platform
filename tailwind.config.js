/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["DM Mono", "JetBrains Mono", "Fira Code", "monospace"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f0ff",
          100: "#e4e4ff",
          200: "#ccccff",
          300: "#aaaaff",
          400: "#8080ff",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};