// this is where i set up my riverside colour scheme so i can use it as class names everywhere
// i named the colours after what they mean to me instead of just calling them gold-1, gold-2 etc

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFFF0',
        cream: '#F5F0E1',
        gold: {
          light: '#E6C878',
          DEFAULT: '#C9A227',
          dark: '#8A6D14',
        },
        charcoal: '#1A1A18', // this is my near black, a touch warm so it does not clash with gold
        ink: '#0D0D0C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
