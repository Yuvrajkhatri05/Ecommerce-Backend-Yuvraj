const jwt = require("jsonwebtoken");
const User = require("../Models/User");

module.exports = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}