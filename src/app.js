import express from "express";
import routes from "./routes";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world.");
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
