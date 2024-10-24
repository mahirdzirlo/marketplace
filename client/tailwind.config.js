/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      padding: "2rem",
    },
    extend: {
      colors: {
        darkBlue: "#1E3A8A",
        lightBlue: "#3B82F6",
        primaryBlack: "#0D0D0D",
        primaryBlue: "#505CFE",
        primaryText: "#FFFFFF",
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
