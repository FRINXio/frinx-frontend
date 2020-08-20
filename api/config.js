const dotenv = require("dotenv");
dotenv.config();

const env = process.env;
const conf = {
  uniconfigHost: env.UNICONFIG_HOST || "uniconfig:8181",
};

module.exports = conf;
