import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Premium Palette
        cream: {
          DEFAULT: "#FDFBF7",
          warm: "#F9F6F0",
          deep: "#F3EDE4",
        },
        ink: {
          DEFAULT: "#1A1915",
          soft: "#2D2A24",
          muted: "#4A4640",
        },
        "warm-gray": {
          DEFAULT: "#8C857A",
          light: "#B5AEA3",
        },
        gold: {
          DEFAULT: "#B8956C",
          light: "#D4B896",
          dark: "#9A7B58",
        },
        plum: {
          DEFAULT: "#5C4B6B",
          light: "#7A6889",
        },
        // Legacy compatibility
        ivory: {
          DEFAULT: "#FDFBF7",
          dark: "#F3EDE4",
        },
        charcoal: {
          DEFAULT: "#1A1915",
          soft: "#2D2A24",
        },
        stone: {
          DEFAULT: "#8C857A",
          light: "#B5AEA3",
        },
        accent: {
          DEFAULT: "#B8956C",
          muted: "#D4B896",
        },
        // shadcn compatibility
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
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["6rem", { lineHeight: "1.0", letterSpacing: "-0.02em" }],
        "display-lg": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "subtle": "0 1px 2px 0 rgb(0 0 0 / 0.03)",
        "soft": "0 4px 20px -4px rgb(0 0 0 / 0.05)",
        "elevated": "0 25px 50px -12px rgb(0 0 0 / 0.08)",
        "premium": "0 30px 60px -15px rgb(0 0 0 / 0.12), 0 0 0 1px rgb(184 149 108 / 0.1)",
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
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-left": {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "fade-in": "fade-in 0.8s ease forwards",
        "slide-left": "slide-left 1s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
