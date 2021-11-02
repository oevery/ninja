module.exports = {
  mode: 'jit',
  purge: {
    // enable: false,
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  },
  important: '#app',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
