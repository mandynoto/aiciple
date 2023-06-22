/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hangin: "#3F83D1", // Replace with your desired color value
        "hangin-100": "#ab9c7f", // Replace with your desired color value
        "hangin-200": "#958669", // Replace with your desired color value
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
