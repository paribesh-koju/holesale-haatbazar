const express = require("express");
const https = require("https");
const { json } = require("express");
const { config } = require("dotenv");
const connectDB = require("./database/database.js"); // Ensure the file extension .js is included
const cors = require("cors");
const fileUpload = require("express-fileupload");
const productRoute = require("./routes/productRoute.js");
const userRoutes = require("./routes/userRoute.js"); // Import the user routes
const fs = require("fs");
const xss = require("xss-clean");
const logger = require("./services/logger.js"); // Import logger
const morgan = require("morgan"); // Log HTTP requests
const mongoSanitize = require("express-mongo-sanitize"); // Sanitize MongoDB input

// Load environment variables
config();

const app = express();
app.use(json());

// File upload config
app.use(fileUpload());

// Load SSL certificates
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert"),
};

// Serve static files from the public directory
app.use("/public", express.static("public"));

// Sanitize MongoDB input
app.use(mongoSanitize());
app.use(xss());

// Set up CORS
const corsOption = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

// Log HTTP requests using Morgan and Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), // Log HTTP requests
    },
  })
);

// Log server start
logger.info("Starting the server...");

// Connect to the database
try {
  connectDB();
} catch (error) {
  console.error("Error connecting to the database:", error);
  process.exit(1); // Exit process with failure
}

// User Routes
app.use("/api/users", userRoutes);

// Product Routes
app.use("/api/products", productRoute);

//providing the port
const PORT = process.env.PORT || 5000;

//starting the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT https://localhost:${PORT}`);
});

// Exporting for testing
module.exports = app;
