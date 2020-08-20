const express = require("express");
const bodyParser = require("body-parser");
const uniconfigAPI = require("./routes/uniconfig");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uniconfig", bodyParser.json(), uniconfigAPI);

const port = process.env.NODE_PORT || 4001;
const host = process.env.NODE_HOST || "0.0.0.0";

app.listen(port, host, function () {
  console.log("Server is listening at http://%s:%s", host, port);
  if (process.send) {
    process.send("online");
  }
});
