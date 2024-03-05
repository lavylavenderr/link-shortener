import type { Config } from "tailwindcss";

const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {},
  plugins: [
    {
      handler: (tw) => {
        tw.matchComponents(
          {
            "bg-grid": (value) => ({
              backgroundSize: "90px 90px",
              backgroundImage: `
								linear-gradient(to right, ${value} 1px, transparent 1px),
								linear-gradient(to bottom, ${value} 1px, transparent 1px)
							`,
            }),
          },
          {
            values: flattenColorPalette(tw.theme("colors")),
            type: "color",
          }
        );

        tw.matchUtilities(
          {
            "text-glow": (value) => ({
              "text-shadow": `0 0 10px ${value}, 0 0 150px ${value}`,
            }),
            glow: (value) => ({
              filter: `drop-shadow(0px 0px 7px ${value})`,
            }),
          },
          {
            values: flattenColorPalette(tw.theme("colors")),
            type: "color",
          }
        );
      },
    },
  ],
};
export default config;
