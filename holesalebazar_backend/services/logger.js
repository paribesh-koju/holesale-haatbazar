const winston = require("winston");

// Configure winston logger
const logger = winston.createLogger({
  level: "info", // Log levels: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      // Return string will be printed to the log
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  // Define log transports
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: "logs/activity.log" }), // Log to file
  ],
});

module.exports = logger;
