/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

export default {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{html,js,vue,ts,jsx,tsx}",
    "./node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      gray: colors.gray,
      blue: colors.sky,
      red: colors.rose,
      pink: colors.fuchsia,
      primary: "#3b82f6", // Default primary color from Flowbite
      secondary: "#6b7280", // Default secondary color from Flowbite
      success: "#10b981", // Default success color from Flowbite
      warning: "#f59e0b", // Default warning color from Flowbite
      error: "#ef4444", // Default error color from Flowbite
    },
    fontFamily: {
      sans: ["Roboto", "Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
