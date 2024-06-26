module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff0000',
        secondary: '#00923f',
      },
      screens: {
        'm': '768px',
        'l': '1024px',
        'xl': '1280px',
        '2xl': '1650px',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      zIndex: {
        '20': '20',
        '30': '30',
      },
      boxShadow: {
        'custom-light': '0 -4px 10px hsla(146, 100%, 29%, 0.4), 0 4px 10px hsla(146, 100%, 29%, 0.8)',
      }
    },
  },
  plugins: [],
};
