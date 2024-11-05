import type { Config } from "tailwindcss";
import { nextui } from  "@nextui-org/theme";

const config: Config = {
  darkMode: "class",

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|modal|input|button|checkbox|select).js",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        scale: "scale 5s ease-in-out infinite",
      },
      keyframes: {
        scale: {
          "0%, 100%": { transform: "scale(0.95)" },
          "50%": { transform: "scale(1.05)" }, // Scale up a little
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1rem", // Extra padding for `sm` screens
          lg: "1rem",
          xl: "1rem",
          "2xl": "1rem",
        },
      },
    },
  },
  plugins: [
    nextui({

      layout: {
        borderWidth: {
          small: "1px", // border-small
          medium: "1px", // border-medium
          large: "2px", // border-large
        },

        
      },
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#000000",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FFFFFF",
              foreground: "#000000",
            },
          },
        },
      },
    }),
  ],
};
export default config;
