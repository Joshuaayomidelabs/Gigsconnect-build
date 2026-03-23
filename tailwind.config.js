module.exports = {
  darkMode: 'class', // enables class-based dark mode
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#4B0082',
          'purple-hover': '#5D00A3',
          'purple-active': '#3A0066',
          'purple-light': '#7B2CBF',
          'purple-soft': '#F3E8FF',
          black: '#000000',
          white: '#FFFFFF',
          gray: '#F8F9FC',
          'dark-card': '#0A0A0A',
        }
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(75, 0, 130, 0.15)',
        'glow': '0 0 20px rgba(75, 0, 130, 0.25)',
      }
    },
  },
  plugins: [],
}
