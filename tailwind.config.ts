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
        primary: {
          50: '#F5F5F3',
          100: '#E8E6E1',
          200: '#D1CEC3',
          300: '#B4AFA0',
          400: '#96907D',
          500: '#1A1A1A', // Rich Black - Main brand color
          600: '#141414',
          700: '#0F0F0F',
          800: '#0A0A0A',
          900: '#050505',
        },
        gold: {
          50: '#FAF8F3',
          100: '#F5F0E5',
          200: '#EBE1CC',
          300: '#DCC9A3',
          400: '#C9A961', // Luxury Gold - Accent color
          500: '#B8954D',
          600: '#9A7A3F',
          700: '#7C6232',
          800: '#5E4A26',
          900: '#40321A',
        },
        success: {
          50: '#F0F7F4',
          100: '#DCEEE5',
          200: '#B9DDCB',
          300: '#7EC4A4',
          400: '#4AAB7E',
          500: '#2D5F3F', // Forest Green
          600: '#254F34',
          700: '#1D3F29',
          800: '#15301F',
          900: '#0D2014',
        },
        warm: {
          50: '#FAFAF8', // Warm White background
          100: '#F5F5F3',
          200: '#ECECEA',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'luxury-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'gold': '0 4px 20px rgba(201, 169, 97, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
