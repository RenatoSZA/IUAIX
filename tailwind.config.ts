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
        royal: '#0F3CC9',
        'brutal-black': '#0f172a', // Mantido para compatibilidade, mas usado de forma mais leve
      },
      boxShadow: {
        // Legado Brutalista
        'brutal': '8px 8px 0px #0f3cc9',
        'brutal-sm': '4px 4px 0px #0f172a',
        'brutal-dark': '8px 8px 0px #0f172a',
        
        // Novos Shadows Minimalistas (Clean & Agradável)
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 8px 30px -4px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 16px 40px -6px rgba(15, 60, 201, 0.08)',
        'soft-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
};
export default config;
