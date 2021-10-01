import express from "express";
import routes from "../routes";
import dotenv from "dotenv";

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello worlds1.");
});

app.use(routes);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown of server
process.once("SIGUSR2", function () {
  console.log("Shutting down");
  process.kill(process.pid, "SIGUSR2");
});
