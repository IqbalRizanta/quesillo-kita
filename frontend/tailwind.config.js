/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EC',
        caramel: { DEFAULT: '#E8A93D', dark: '#B7791F', light: '#FFC98B' },
        choco: '#5C3D2E',
        berry: '#FF8FA3',
        butter: '#FFD966',
        mint: '#7ED6A5',
        skysoft: '#A8D8FF',
        tomato: '#E76F51'
      },
      fontFamily: {
        chubby: ['Fredoka', '"Baloo 2"', 'system-ui', 'sans-serif'],
        hand: ['"Gochi Hand"', 'cursive'],
        body: ['Nunito', 'Quicksand', 'system-ui', 'sans-serif']
      },
      boxShadow: { soft: '0 8px 24px rgba(92,61,46,.12)' }
    }
  },
  plugins: []
};
