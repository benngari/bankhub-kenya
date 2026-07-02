import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1320px" },
    },
    extend: {
      colors: {
        // Core brand — deep forest green, evokes trust, growth, Kenyan highlands
        forest: {
          50: "#EAF3EE",
          100: "#CFE4D8",
          200: "#A2CBB5",
          300: "#6FAE8E",
          400: "#3F8F6B",
          500: "#26744F", // primary
          600: "#1B5E3F",
          700: "#154B33",
          800: "#123D2A",
          900: "#0D2E20",
          950: "#081F16",
        },
        // Accent — warm gold, for CTAs, highlights, rates
        gold: {
          50: "#FBF4E4",
          100: "#F5E4BD",
          200: "#EDCC85",
          300: "#E4B24E",
          400: "#D9A441",
          500: "#C68C2A",
          600: "#A66F1F",
          700: "#7E5419",
          800: "#5A3C13",
        },
        ink: {
          DEFAULT: "#12181A",
          soft: "#2B3538",
        },
        paper: {
          DEFAULT: "#FAF8F3",
          muted: "#F1EEE5",
        },
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 6px)",
        "2xl": "calc(var(--radius) + 14px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(13,46,32,0.04), 0 8px 24px -8px rgba(13,46,32,0.10)",
        lift: "0 2px 8px rgba(13,46,32,0.06), 0 24px 48px -16px rgba(13,46,32,0.18)",
        glass: "0 8px 32px rgba(13,46,32,0.10)",
      },
      backgroundImage: {
        "mesh-hero":
          "radial-gradient(60% 60% at 15% 10%, rgba(38,116,79,0.18) 0%, rgba(38,116,79,0) 60%), radial-gradient(50% 50% at 85% 0%, rgba(217,164,65,0.16) 0%, rgba(217,164,65,0) 60%), radial-gradient(70% 60% at 50% 100%, rgba(38,116,79,0.10) 0%, rgba(38,116,79,0) 60%)",
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
