const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

console.log(process.env.WF_SERVER)

const odlAPI = require("./routers/odl");
const conductorAPI = require("./routers/conductor");

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/conductor", bodyParser.json(), conductorAPI);
app.use("/api/odl", bodyParser.json(), odlAPI);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.NODE_PORT || 3001;
const host = process.env.NODE_HOST || "0.0.0.0";

app.listen(port, host, function() {
  console.log("Server is listening at http://%s:%s", host, port);
  if (process.send) {
    process.send("online");
  }
});
