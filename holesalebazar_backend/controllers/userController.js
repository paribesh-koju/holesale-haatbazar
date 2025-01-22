const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const nodemailer = require("nodemailer");

// Register User
const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  //checking if the user name is empty
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    //if the password is not valid
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    });
  }

  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }
  try {
    const existingUser = await User.findOne({ email });
    // Check if the user already exists
    if (existingUser) {
      console.error("User already exists:", email);
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = new User({
      username,
      email,
      password, // Password will be hashed in the pre-save hook
      passwordExpiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000,
    });

    await newUser.save();
    console.log("User registered successfully:", email);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  //putting captcha token in req.body
  const { email, password, captchaToken } = req.body;
  if (!email || !password || !captchaToken) {
    //if email or password not provided
    console.error("Email or password not provided");
    return res
      .status(400)
      .json({ success: false, message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found for email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    //putting this in try catch block to avoid the error message to be displayed in the console
    if (user.lockUntil && user.lockUntil > Date.now()) {
      //if the user is locked
      return res.status(400).json({
        success: false,
        message: `Account locked. Please try again after ${new Date(
          user.lockUntil
        ).toLocaleString()}.`,
      });
    }

    console.log("Plain password:", password);
    console.log("Stored hashed password:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);
    //checking if the password is correct
    if (!isMatch) {
      //if the password is incorrect then the failed login attempts will be increased by 1
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = Date.now() + 5 * 60 * 1000; // Lock account for 5 minutes
        //setting the failed login attempts to zero
        user.failedLoginAttempts = 0;
      }
      await user.save();
      console.error("Invalid password for user:", email);
      return res
        .status(400)
        .json({ success: false, message: "Password Invalid" });
    }
    user.failedLoginAttempts = 0;
    //resetting the lock until to null
    user.lockUntil = null;
    await user.save();

    //generating the token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    //sending the user data to the frontend
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    res.json({ success: true, message: "Login successful", token, userData });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user.userId);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;

      if (password) {
        user.password = password; // Assign plain password, let pre-save hook hash it
      }

      if (req.file) {
        user.profileImage = req.file.path; // Assuming you have a profileImage field in your User model
      }

      const updatedUser = await user.save();
      console.log("Updated user:", updatedUser); // Log updated user
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    //handling the error on the update user profile
    console.error("Error updating user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); //using math function to generate the random otp

    // Set OTP and expiry
    user.otpReset = otp;
    user.otpResetExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Send email
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kojuparibesh1234@gmail.com",
        pass: "nrkx mdil kvts zpmp",
      },
    });

    //sending the mail form the main user to anther for the otp user

    var mailOptions = {
      from: "kojuparibesh1234@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    };

    //sending the mail to the user
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Password reset OTP sent" });
      }
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Server error" }); // Handle server errors
  }
};

// Verify OTP and Set New Password
const verifyOtpAndPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const now = Date.now();
    const otpResetExpires = user.otpResetExpires.getTime();

    //print the data that the user type from frontend
    console.log(`Current Time (ms): ${now}`);
    console.log(`OTP Expiry Time (ms): ${otpResetExpires}`);
    console.log(`Stored OTP: ${user.otpReset}`);
    console.log(`Provided OTP: ${otp}`);

    //checking if the otp is correct
    if (user.otpReset != otp) {
      console.log("Provided OTP does not match stored OTP");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    //if otp expire function to handle the otp comming from the email

    if (otpResetExpires < now) {
      console.log("OTP has expired");
      return res.status(400).json({ message: "Expired OTP" });
    }

    user.password = password; // using password pre-save hook up from model
    //setting the password expires at to 90 days
    user.passwordExpiresAt = Date.now() + 90 * 24 * 60 * 60 * 1000;
    user.otpReset = undefined;
    // Reset OTP reset
    user.otpResetExpires = undefined;
    await user.save();

    //success full message response in 200
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Exporting the user routes
module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  verifyOtpAndPassword,
};
