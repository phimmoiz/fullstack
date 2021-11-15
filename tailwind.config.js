const colors = require("tailwindcss/colors");

module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.hbs", "./src/**/*.js"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      facebook: "#3b5998",
      google: "#EA4335",
    },

    extend: {},
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      width: ["group-hover"],
      height: ["group-hover"],
      mixBlendMode: ["hover"],
    },
  },
  plugins: [require("daisyui")],
  important: true,
};
