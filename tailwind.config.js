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
      scale: ["group-hover"]
    },
  },
  plugins: [require("daisyui")],
};
