const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const bodyParser = require("body-parser");
const { execSync } = require("child_process");

const app = express();

app.use(express.static(path.join(__dirname, "../build")));
app.use(bodyParser.urlencoded({ extended: false }));

// serve UI static files
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const port = process.env.NODE_PORT || 4000;
const host = process.env.NODE_HOST || "0.0.0.0";

const genCert = () => {
  const command = `rm -rf ./certificates && mkdir ./certificates && cd ./certificates && ${process.env.OPENSSL_COMMAND_TO_GEN_CERT}`
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

if (process.env.OPENSSL_COMMAND_TO_GEN_CERT) {
  genCert()
}

if (process.env.HTTPS == 'true') {
  const server = https.createServer({
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem'),
    passphrase: process.env.PASSPHRASE
  }, app)

  server.listen(port, function () {
    console.log("Server is listening at https://%s:%s", host, port);
    if (process.send) {
      process.send("online");
    }
  });

  const reload_certificates = () => {
    server.setSecureContext({
      key: fs.readFileSync('./certificates/key.pem'),
      cert: fs.readFileSync('./certificates/cert.pem'),
    })
  }

  if (process.env.RENEW_PERIOD) {
    setInterval(() => {
      genCert()
      reload_certificates()
    }, parseInt(process.env.RENEW_PERIOD))
  }


} else {
  app.listen(port, host, function () {
    console.log("Server is listening at http://%s:%s", host, port);
    if (process.send) {
      process.send("online");
    }
  });
}
