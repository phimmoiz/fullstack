import hbs from "hbs";
import path from "path";

console.log(__dirname);

const config = (app) => {
  app.set("views", [
    path.join(__dirname, "../views"),
    path.join(__dirname, "../components"),
  ]);
  app.set("view engine", "hbs");
  hbs.registerPartials(
    path.join(__dirname, "../views/partials"),
    function (err) {}
  );
  hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
  });
  hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
  });
};

export default config;
