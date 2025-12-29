import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "rgb(var(--brand-navy) / <alpha-value>)",
          orange: "rgb(var(--brand-orange) / <alpha-value>)",
          blue: "rgb(var(--brand-blue) / <alpha-value>)",
          sky: "rgb(var(--brand-sky) / <alpha-value>)",
          sand: "rgb(var(--brand-sand) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
