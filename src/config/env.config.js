import "dotenv/config";

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tu_base_de_datos";
export const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";
export const HF_API_KEY = process.env.HF_API_KEY || "";
