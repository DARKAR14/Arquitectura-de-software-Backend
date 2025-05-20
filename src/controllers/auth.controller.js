import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

// Registro de usuario
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
  }
};

// Inicio de sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Generar el token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Guardar el token en una cookie HTTP-only
    res.cookie("authToken", token, {
      httpOnly: true,   // Impide que el JS del front lo lea
      secure: false,    // Poner en true si tu servidor corre sobre HTTPS
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    // Devolver un mensaje y datos básicos del usuario
    return res.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("authToken");
  return res.json({ message: "Sesión cerrada" });
};
