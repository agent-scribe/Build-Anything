import type { Config } from "tailwindcss";

/**
 * The app chrome uses Tailwind's core utilities (zinc palette + layout).
 * The generated *site* is themed via inline CSS variables set by
 * ThemeProvider, so we don't extend the color palette here.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
