const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyOtpAndPassword,
} = require("../controllers/userController.js");
const { authGuard } = require("../middleware/authGuard.js");

const router = express.Router();

//providing the route for all
router.post("/register", registerUser); //Route for the register
router.post("/login", loginUser); //Route for the login
router.get("/profile", authGuard, getUserProfile); // Route to fetch user profile
router.put("/updateprofile", authGuard, updateUserProfile); // Route to update user profile

router.post("/forgot_password", forgotPassword); //Route for the forgot password

router.post("/verify_otp", verifyOtpAndPassword); //Route for the verify the password form the otp

module.exports = router;
