const {onRequest} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/logger");

exports.helloWorld = onRequest((req, res) => {
  logger.info("HelloWorld function was triggered!");
  res.send("Hello from Firebase!");
});
