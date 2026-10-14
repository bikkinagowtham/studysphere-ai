/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#070b14",
        foreground: "#f8fafc",
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          accent: "#06b6d4",
          violet: "#8b5cf6",
          emerald: "#10b981",
        },
        surface: {
          DEFAULT: "#0f172a",
          card: "rgba(15, 23, 42, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(30, 41, 59, 0.8)",
          glass: "rgba(255, 255, 255, 0.03)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cal)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))",
        "mesh-glow": "radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.12) 0px, transparent 50%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { opacity: 0.4 },
          "100%": { opacity: 0.9 },
        }
      }
    },
  },
  plugins: [],
};
