require("dotenv").config();

function getAppName() {
  return process.env.APP_NAME || "My App";
}

module.exports = {
  getAppName,
};
