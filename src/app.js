import express from "express";
import routes from "./routes";
import path, { dirname } from "path";
import hbs from "hbs";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { checkAuth } from "./middlewares/auth.middleware";
import { connect } from "./lib/mongodb";

require("dotenv").config();

const PORT = process.env.PORT || 3000;

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
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// Add body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());

// Mongodb connect
connect();

// Middleware to check if mongoose is connected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    return next(createError(503, "MongoDB connection is not established"));
  }
  next();
});

// Morgan
app.use(morgan("dev"));

// Auth check
app.use(checkAuth);

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
  res.render("error", { title: "Error" });
});

app.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`);
});
