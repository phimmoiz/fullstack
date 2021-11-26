import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/film-streaming";

export const connect = () => {
  console.log("[database] Connecting to MongoDB...");

  // Connect mongoose and console log if connect successfully
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("[database] MongoDB connected"))
    .catch((err) => console.log(err));
};
