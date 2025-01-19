const express = require("express");
const { json } = require("express");
const { config } = require("dotenv");
const connectDB = require("./database/database.js"); // Ensure the file extension .js is included
const cors = require("cors");
const fileUpload = require("express-fileupload");
const productRoute = require("./routes/productRoute.js");
const userRoutes = require("./routes/userRoute.js"); // Import the user routes

// Load environment variables
config();

const app = express();
app.use(json());

// File upload config
app.use(fileUpload());

// Serve static files from the public directory
app.use("/public", express.static("public"));

// Set up CORS
const corsOption = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

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

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// Exporting for testing
module.exports = app;
