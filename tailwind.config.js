/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        mushroom: {
          brown: '#8B4513',
          lightBrown: '#D2691E',
          cream: '#FAEBD7',
          red: '#DC143C',
          orange: '#FF8C00',
          yellow: '#FFD700',
        },
        forest: {
          dark: '#2D5016',
          medium: '#4A7C2E',
          light: '#6B8E23',
        },
      },
      fontFamily: {
        sans: ['System', '-apple-system', 'BlinkMacSystemFont'],
      },
    },
  },
  plugins: [],
}