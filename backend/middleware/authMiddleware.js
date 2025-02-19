const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Ensure correct path

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    token = token.split(" ")[1]; // Extract token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user data without password (only if needed)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found." });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = { authenticateUser };
