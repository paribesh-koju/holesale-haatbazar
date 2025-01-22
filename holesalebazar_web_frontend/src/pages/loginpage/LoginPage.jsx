import React, { useState } from "react";
import { FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
import { loginUser } from "../../apis/Api";
import { toast } from "react-toastify";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../forgotpassword/ForgotPassword";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReCAPTCHA from "react-google-recaptcha";

const LoginPage = ({ setCartProducts }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const navigate = useNavigate();

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  // Assess password strength
  const assessPasswordStrength = (password) => {
    if (password.length < 8) return "Weak";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

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
    try {
      const response = await loginUser({ email, password, captchaToken });
      // Log successful login
      console.log("Login successful", response);
      toast.success("Login successful!");

      // Set token
      localStorage.setItem("token", response.data.token);

      // Convert JSON object
      const convertedData = JSON.stringify(response.data.userData);

      // Set user data in local storage
      localStorage.setItem("user", convertedData);

      // Initialize cart for the logged-in user
      const userId = response.data.userData._id;
      const cartKey = `cartProducts_${userId}`;
      const savedCart = localStorage.getItem(cartKey);
      setCartProducts(savedCart ? JSON.parse(savedCart) : []);

      navigate("/redirect");
    } catch (error) {
      // Handle error
      console.error("Login failed", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Close forgot password modal
  const handleForgotPasswordClose = () => setShowForgotPassword(false);
  const handleForgotPasswordShow = () => setShowForgotPassword(true);

  // Render login page
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
      <div className="card p-4 shadow login-card">
        <div className="text-center mb-4 logo-container">
          <img
            src="/assets/images/highlight.png"
            alt="Logo"
            className="logo mb-3"
          />
          <h2>HolesaleBazar</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3 input-group">
            <span className="input-group-text">
              <FaUser />
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
              onChange={(e) => handlePasswordInput(e.target.value)}
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              // onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="input-group-text password-toggle-icon"
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

          <div className="mb-3">
            <ReCAPTCHA
              sitekey="6LflQ7kqAAAAAN1YIhR92_LfxphhpglxSX--gmba" // Replace with your reCAPTCHA site key
              onChange={onCaptchaChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <button
            onClick={handleForgotPasswordShow}
            type="button"
            className="btn btn-link text-decoration-none"
          >
            Forget password?
          </button>{" "}
          <span>or</span>{" "}
          <a href="/register" className="text-decoration-none">
            Sign up
          </a>
        </div>
      </div>
      <Modal show={showForgotPassword} onHide={handleForgotPasswordClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ForgotPassword />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleForgotPasswordClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;
