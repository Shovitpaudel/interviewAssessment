/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom: '0px 1px 4px 0px rgba(20, 3, 66, 0.07)',
      },
      borderColor: {
        custom: 'rgba(6, 102, 153, 1)',
      },
      colors: {
        customTextColor: 'rgba(6, 102, 153, 1)',
      },
      backgroundColor: {
        customBg: 'rgba(6, 102, 153, 1)',
      },
    },
  },
  plugins: [],
}
