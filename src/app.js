import express from "express";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import exphbs from "express-handlebars";

const PORT = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.set("views", path.join(__dirname, "/views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Routing
app.use(routes);

// Catch 404
app.use((req, res, next) => {
  res.status(404).render("404", {
    title: "404",
    message: "Page not found",
  });
});

// Error handler expressjs
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: err,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
