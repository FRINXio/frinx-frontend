const express = require("express");
const https = require('https');
const path = require('path');
const fs = require('fs');
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config();
}

const odlAPI = require("./routers/odl");
const conductorAPI = require("./routers/conductor");

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api/conductor", bodyParser.json(), conductorAPI);
app.use("/api/odl", bodyParser.json(), odlAPI);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const port = process.env.NODE_PORT || 3001;
const host = process.env.NODE_HOST || "0.0.0.0";

// if certificates folder is empty use HTTP
// else HTTPS is used (key.pem and cert.pem must be present in folder)
fs.readdir('./certificates', function (err, files) {
  if (!files.length) {
    app.listen(port, host, function () {
      console.log("Server is listening at http://%s:%s", host, port);
      if (process.send) {
        process.send("online");
      }
    });
  } else {
    https.createServer({
      key: fs.readFileSync('./certificates/key.pem'),
      cert: fs.readFileSync('./certificates/cert.pem'),
      passphrase: 'passphrase'
    }, app).listen(port, function () {
      console.log('Server is listening on port %s', port)
    });
  }
});
