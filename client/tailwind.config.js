/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      /*font famly{} imported */
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'kanit': ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}