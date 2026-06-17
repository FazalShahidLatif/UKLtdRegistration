/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.ejs",
    "./public/**/*.js",
    "./content/**/*.json"
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          blue: '#0056b3',
          green: '#28a745',
          navy: '#002b5c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
