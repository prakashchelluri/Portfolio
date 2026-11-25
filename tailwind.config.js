/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom terminal/dashboard colors
        // "Signal" theme: near-black console, lime for healthy/primary, sky for data.
        terminal: {
          bg: '#080b0f',
          border: '#1f2731',
          text: '#e6ebf1',
          muted: '#8a94a3',
        },
        dashboard: {
          bg: '#05070a',
          panel: '#0b0f14',
          border: '#18202a',
        },
        neon: {
          green: '#b4f04a',
          cyan: '#5cc8ff',
          amber: '#ffb547',
          red: '#ff5c5c',
          purple: '#a78bfa',
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "cursor-blink": {
          "0%,50%": { opacity: "1" },
          "51%,100%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 8px rgba(180, 240, 74, 0.35)" },
          "50%": { boxShadow: "0 0 18px rgba(180, 240, 74, 0.7)" },
        },
        "pulse-cyan": {
          "0%,100%": { boxShadow: "0 0 8px rgba(92, 200, 255, 0.3)" },
          "50%": { boxShadow: "0 0 18px rgba(92, 200, 255, 0.6)" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "20" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-cyan": "pulse-cyan 2s ease-in-out infinite",
        "dash-flow": "dash-flow 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
