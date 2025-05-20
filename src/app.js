// src/app.js (ES Modules)
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import testRoutes from "./routes/test.routes.js";
import questionRoutes from "./routes/question.routes.js";
import resultRoutes from "./routes/result.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.config.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Permite todas las peticiones, incluso las que no tienen "origin" (como las de apps nativas o curl)
    callback(null, true);
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app; // (Opcional) Para pruebas
