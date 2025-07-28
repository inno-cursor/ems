import jwt from "jsonwebtoken";
import Admin from "../models/Admins.model.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
