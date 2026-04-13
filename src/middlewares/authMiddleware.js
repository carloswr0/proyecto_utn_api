import jwt from "jsonwebtoken";
import ENVIRONTMENT from "../config/environment.config.js";

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    } else {
      jwt.verify(token, ENVIRONTMENT.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware;
