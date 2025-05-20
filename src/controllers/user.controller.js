import User from "../models/user.model.js";

/**
 * GET /users/profile
 * Devuelve la información básica del usuario.
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.json({ user });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return res.status(500).json({ error: "Error interno al obtener perfil" });
  }
};
