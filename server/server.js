const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "../build")));
app.use(bodyParser.urlencoded({ extended: false }));

// serve UI static files
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const port = process.env.NODE_PORT || 4000;
const host = process.env.NODE_HOST || "0.0.0.0";

app.listen(port, host, function () {
  console.log("Server is listening at http://%s:%s", host, port);
  if (process.send) {
    process.send("online");
  }
});
