const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header not found!",
    });
  }
  //passing the token in the auth header for the verification
  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing",
    });
  }

  //using try catch for the decoded user for the token comming for jwt-secret
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decodedUser);
    req.user = decodedUser;
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    res.status(400).json({
      success: false,
      message: "Not Authenticated!",
    });
  }
};

//validiting the adimin guard by passing token in the header
const adminGuard = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({
      success: false,
      message: "Authorization header not found!",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token:", token);

  if (!token || token === "") {
    return res.status(400).json({
      success: false,
      message: "Token is missing",
    });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", decodedUser);
    req.user = decodedUser;

    if (!req.user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Permission denied",
      });
    }

    next();
  } catch (error) {
    console.log("JWT Verification Error:", error);
    res.status(400).json({
      success: false,
      message: "Not Authenticated!",
    });
  }
};

module.exports = {
  authGuard,
  adminGuard,
};
