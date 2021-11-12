import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import hbs from "hbs";
import morgan from "morgan";

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();

// Static files
app.use(express.static("public"));

// View engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "hbs");
hbs.registerPartials(
  path.join(__dirname, "/views/partials"),
  function (err) {}
);

// Morgan
app.use(morgan("dev"));

// Routing
app.use(routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log(path.join(__dirname, "/views/partials"));
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
