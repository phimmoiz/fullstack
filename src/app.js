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
import csurf from "csurf";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";

//
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Message from "./models/message.model";

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
  function (err) { }
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

hbs.registerHelper('ifBelong', function (arg1, arg2, options) {
  return (arg1.includes(arg2)) ? options.fn(this) : options.inverse(this);
});

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

io.on("connection", (socket) => {
  socket.on("chat message", async (content) => {
    try {
      const { token } = cookie.parse(socket.handshake.headers.cookie); // get cookies from the client

      if (!token) {
        return;
      }

      let user = await jwt.verify(token, process.env.JWT_SECRET);

      if (!user) return; // TODO: Tell user that he is not authorized

      //command check
      if (content.startsWith("/clear") && user.role === "admin") {
        await Message.deleteMany({});

        content = `Admin cleared all messages (/clear)`;
        io.emit("delete all messages", newMessage);
      }

      const newMessage = await (
        await Message.create({
          author: user.id,
          content,
        })
      ).populate({
        path: "author",
        select: "username avatar role",
      });

      io.emit("chat message receive", newMessage);
    } catch (err) {
      console.log("[socket]", err);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[server] Server running at http://localhost:${PORT}`);
});
