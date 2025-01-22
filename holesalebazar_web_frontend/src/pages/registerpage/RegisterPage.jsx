// src/pages/registerpage/RegisterPage.jsx
import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEyeSlash, FaEye } from "react-icons/fa";
import { registerUser } from "../../apis/Api";
import { toast } from "react-toastify";
import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  // Assess password strength
  const assessPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    // Check if password has at least one uppercase letter, one lowercase letter, one number, and one special character
    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)
      return "Strong";
    if (hasUpperCase || hasLowerCase) return "Moderate";
    return "Weak";
  };
  const handlePasswordInput = (password) => {
    setPassword(password);
    setPasswordStrength(assessPasswordStrength(password));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await registerUser({
        username,
        email,
        password,
        confirmPassword,
      });
      console.log("Register successful", response);
      toast.success("Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      // Handle successful registration (e.g., redirect to login)
    } catch (error) {
      console.error("Registration failed", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const validatePasswordStrength = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }
    return "";
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage:
          'url("https://c8.alamy.com/comp/T5J312/food-background-with-organic-vegetables-healthy-food-or-diet-concept-website-background-T5J312.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card p-4 shadow register-card">
        <div className="text-center mb-4">
          <img
            src="/assets/images/highlight.png"
            alt="Logo"
            className="logo mb-3"
          />
          <h2>Register</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              // onChange={(e) => handlePasswordInput(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={
                ((e) => setPassword(e.target.value),
                (e) => handlePasswordInput(e.target.value))
              }
              required
            />
            <span
              className="input-group-text"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {password && (
            <div className="text-muted">
              <strong>Password Strength: {passwordStrength}</strong>
            </div>
          )}
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <input
              // onChange={(e) => handlePasswordInput(e.target.value)}
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="input-group-text"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
