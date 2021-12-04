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
  hbs.registerHelper("ifNotEquals", function (arg1, arg2, options) {
    return arg1 != arg2 ? options.fn(this) : options.inverse(this);
  });
  hbs.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
  });
  hbs.registerHelper("json", function (context) {
    return JSON.stringify(context);
  });
  hbs.registerHelper("switch", function (value, options) {
    this.switch_value = value;
    return options.fn(this);
  });

  hbs.registerHelper("case", function (value, options) {
    if (value == this.switch_value) {
      return options.fn(this);
    }
  });

  hbs.registerHelper("default", function (value, options) {
    return true; ///We can add condition if needs
  });
};

export default config;
