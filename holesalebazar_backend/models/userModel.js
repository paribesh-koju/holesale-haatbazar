const { Schema, model } = require("mongoose");
const { genSalt, hash } = require("bcrypt");

// Creating the schema for the fields that the user provides for further processing
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otpReset: {
    type: Number,
    default: null,
  },
  otpResetExpires: {
    type: Date,
    default: null,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0, // Starts with zero failed attempts
  },
  lockUntil: {
    type: Date,
    default: null, // Account is not locked by default
  },
  passwordExpiresAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }, // Adding isAdmin field to handle user roles
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  //using
  try {
    //generating the random value befor passing hashing it
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Helper method to check if the account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

const User = model("User", userSchema);
module.exports = User;
