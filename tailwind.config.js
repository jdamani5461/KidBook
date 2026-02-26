/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple:  '#7C3AED',
          pink:    '#EC4899',
          yellow:  '#FBBF24',
          sky:     '#38BDF8',
          green:   '#34D399',
          orange:  '#F97316',
        },
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body:    ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
