const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.hbs", "./src/**/*.js"],
    development: true,
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      facebook: "#3b5998",
      google: "#EA4335",
    },

    borderWidth: {
      ...defaultTheme.borderWidth,
      0: "0",
    },

    extend: {},
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      width: ["group-hover"],
      height: ["group-hover"],
      mixBlendMode: ["hover"],
      borderWidth: ["dark"],
    },
  },
  darkMode: "class",
};
