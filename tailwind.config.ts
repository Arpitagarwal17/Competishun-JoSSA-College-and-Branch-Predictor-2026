import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Aptos", "Segoe UI Variable", "Segoe UI", "sans-serif"],
        display: ["Cambria", "Georgia", "serif"]
      },
      colors: {
        canvas: "#f4f7ff",
        ink: "#121936",
        muted: "#667085",
        line: "#d9e3fb",
        panel: "#ffffff",
        "panel-strong": "#f8fbff",
        slatepanel: "#f2f6fc",
        bluebrand: "#07009f",
        "bluebrand-dark": "#03006d",
        orangebrand: "#ff5b00",
        "orangebrand-dark": "#dd4c00",
        brass: "#ff5b00",
        forest: "#07009f",
        clay: "#c43b2f",
        skyquiet: "#0b62d8"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(7, 0, 159, 0.09)"
      }
    }
  },
  plugins: []
};

export default config;
