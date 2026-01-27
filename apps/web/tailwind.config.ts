import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef7ee',
          100: '#fcecd7',
          200: '#f8d5ae',
          300: '#f3b87b',
          400: '#ed9145',
          500: '#e87420',
          600: '#d95a16',
          700: '#b44315',
          800: '#903618',
          900: '#742f17',
          950: '#3e150a',
        },
        forest: {
          50: '#f3faf3',
          100: '#e3f5e3',
          200: '#c8eaca',
          300: '#9dd9a2',
          400: '#6bc073',
          500: '#46a34f',
          600: '#35853d',
          700: '#2d6933',
          800: '#28542c',
          900: '#234526',
          950: '#0f2512',
        },
        'herd-green': '#2D5016',
        'herd-green-dark': '#1E3A0F',
        'herd-green-light': '#3D6B1E',
        'herd-cream': '#F5F2EB',
        'herd-brown': '#8B7355',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
