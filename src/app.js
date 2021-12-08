import express from "express";
import routes from "./routes";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { checkAuth } from "./middlewares/auth.middleware";
import { connect } from "./lib/mongodb";
import csurf from "csurf";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import { default as messageSocket } from "./components/messages/messagesSocket";
import { default as viewEngineConfig } from "./config/viewEngine";

//
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Message from "./components/messages/messageModel";

require("dotenv").config();

// Heroku use its custom port
const PORT = process.env.PORT || 3000;

// Create app
const app = express();


// Static files
app.use(express.static("public"));

// View engine
viewEngineConfig(app);

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "MYSUPERSECRET",
    resave: false,
    saveUninitialized: false,
  })
);

// Add body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser
app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken();
  next();
});

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

// SocketIO
const server = createServer(app);
const io = new Server(server, {});

// Live time messages
messageSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`);
});
