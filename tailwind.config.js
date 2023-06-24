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
        "hangin-100": "#C4A484", // Replace with your desired color value
        "hangin-200": "#958669", // Replace with your desired color value
        normal: {
          dark: "#444653",
          light: "#FFFFFF",
        },
        footer: {
          dark: "#515360",
          // light: "#eff0f2",
          // light: "#eff0f2",
          // light: "#FFFFFF",
          light: "#fcfcfc",
        },
        front: {
          light: "#FFFFFF",
          dark: "#000000",
        },
        side: {
          light: "#F5F6F8",
          // dark: "#6c6561",
          dark: "#202123",
        },
        text: {
          light: "#FFFFFF",
          dark: "#000000",
        },
        aiciple: {
          light: "#eeeeef",
          dark: "#4e505d",
        },
        "aiciple-icon": {
          light: "#C4A484",
          dark: "#C4A484",
        },
        prose: {
          light: "#F6F7F8",
          dark: "#292C33",
        },
        "code-block": {
          light: "#F6F7F8",
          dark: "#292C33",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
