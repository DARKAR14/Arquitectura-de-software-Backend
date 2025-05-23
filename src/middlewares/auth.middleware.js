import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

export const verifyToken = (req, res, next) => {
  const token = 
    req.cookies?.authToken ||                          // desde cookie
    req.headers.authorization?.split(" ")[1];          // desde header Authorization

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id.toString() };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token no válido" });
  }
};
