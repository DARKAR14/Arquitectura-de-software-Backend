import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

export const verifyToken = (req, res, next) => {
  // Obtener el token desde la cookie 'authToken'
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token no válido" });
  }
};
