"use strict";

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = process.env.PORT || 3000;

_dotenv["default"].config();

var app = (0, _express["default"])();
app.get("/", function (req, res) {
  res.send("Hello worlds1ss.");
});
app.use(_routes["default"]);
var server = app.listen(PORT, function () {
  console.log("Server running at http://localhost:".concat(PORT));
}); // Graceful shutdown of server

process.once("SIGUSR2", function () {
  console.log("Shutting down");
  process.kill(process.pid, "SIGUSR2");
});