import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import hbs from "hbs";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/film-streaming";

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

// Add body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect mongoose and console log if connect successfully
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
// mongoose.connection.on("connected", () => {
//   console.log("Mongoose is connected");
// });

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
