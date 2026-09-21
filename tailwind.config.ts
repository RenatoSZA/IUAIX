import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          DEFAULT: '#0f3cc9',
          dark: '#0a237a',
          light: '#3d63e0'
        },
        brutal: {
          black: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(15, 60, 201, 1)',
        'brutal-dark': '4px 4px 0px 0px rgba(15, 23, 42, 1)',
        'brutal-sm': '2px 2px 0px 0px rgba(15, 23, 42, 1)',
      }
    },
  },
  plugins: [],
};
export default config;
