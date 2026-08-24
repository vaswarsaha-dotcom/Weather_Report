import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0D1321",
        dusk: "#161F38",
        dusk2: "#1E2A4A",
        cloud: "#F4F6FA",
        paper: "#FFFFFF",
        amber: {
          DEFAULT: "#F5A623",
          soft: "#FFD187"
        },
        cyan: {
          DEFAULT: "#35C5E0",
          soft: "#9FE8F2"
        },
        slate: {
          DEFAULT: "#7C89A6",
          dim: "#4B5773"
        }
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      backgroundImage: {
        "isobar-glow":
          "radial-gradient(circle at 20% 20%, rgba(53,197,224,0.18), transparent 45%), radial-gradient(circle at 80% 0%, rgba(245,166,35,0.15), transparent 40%)"
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
        "glass-inset": "inset 0 1px 0 rgba(255,255,255,0.08)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(2%,-2%)" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "count-up": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards"
      }
    }
  },
  plugins: []
};

export default config;
