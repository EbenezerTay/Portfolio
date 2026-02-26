import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ai-bg": "#020617",
        "ai-surface": "rgba(15,23,42,0.85)",
        "ai-border": "rgba(148,163,184,0.35)",
        "ai-accent": "#4f46e5",
        "ai-accent-soft": "#22d3ee",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "ai-soft": "0 0 40px rgba(56,189,248,0.15)",
        "ai-strong": "0 0 80px rgba(129,140,248,0.35)",
      },
      backgroundImage: {
        "ai-glass":
          "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))",
        "ai-gradient":
          "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.2), transparent 55%), radial-gradient(circle at 100% 0%, rgba(129,140,248,0.2), transparent 55%), radial-gradient(circle at 50% 100%, rgba(56,189,248,0.18), transparent 50%)",
      },
      animation: {
        "float-slow": "float 14s ease-in-out infinite",
        "float-medium": "float 10s ease-in-out infinite",
        "pulse-soft": "pulseSoft 6s ease-in-out infinite",
        "particle-orbit": "particleOrbit 18s linear infinite",
        "gradient-move": "gradientMove 22s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -12px, 0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 0.9, transform: "scale(1.04)" },
        },
        particleOrbit: {
          "0%": { transform: "rotate(0deg) translateX(12px) rotate(0deg)" },
          "100%": {
            transform: "rotate(360deg) translateX(12px) rotate(-360deg)",
          },
        },
        gradientMove: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(-30px, 20px, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
