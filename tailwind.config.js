module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.hbs", "./src/**/*.js"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      scale: ["group-hover"],
      width: ["group-hover"],
      height: ["group-hover"],
    },
  },
  plugins: [require("daisyui")],
  important: true,
};
