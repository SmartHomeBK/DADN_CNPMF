/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        italianno: ["Italianno", "cursive"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        "weather-blue": "#ebf8ff",
        "sidebar-pink": "#d09696",
        "button-beige": "#f5e7d4",
        "button-text": "#21255a",
        "temp-red": "#c43d3d",
        "humidity-blue": "#1ea0e9",
        "light-yellow": "#ecc94b",
      },
    },
  },
  plugins: [],
};
