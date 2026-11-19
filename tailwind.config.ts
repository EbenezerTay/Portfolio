import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // Editor-style palette. Token names kept so every page picks up the theme.
        "ai-bg": "#0a0d12",
        "ai-surface": "#10151c",
        "ai-panel": "#0d1117",
        "ai-border": "#222b36",
        "ai-accent": "#059669",
        "ai-accent-soft": "#34d399",
        "ai-muted": "#7d8590",
        // Syntax colours
        "syn-kw": "#c792ea",
        "syn-fn": "#82aaff",
        "syn-str": "#ecc48d",
        "syn-num": "#f78c6c",
        "syn-prop": "#7fdbca",
        "syn-com": "#5c6773",
      },
      borderRadius: {
        xl: "0.625rem",
        "2xl": "0.75rem",
        "3xl": "0.875rem",
      },
      boxShadow: {
        "ai-soft": "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px -16px rgba(0,0,0,0.6)",
        "ai-strong": "0 24px 64px -24px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "ai-glass": "linear-gradient(180deg, #121821, #0f141b)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [],
};

export default config;
