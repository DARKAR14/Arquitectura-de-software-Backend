// src/routes/test.routes.js
import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import multer from "multer";

const router = Router();
const upload = multer(); // guarda en memoria

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Crear un test analizando un PDF con IA
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - difficulty
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF con el contenido a analizar
 *               difficulty:
 *                 type: string
 *                 description: Dificultad del test (p.ej. fácil, medio, difícil)
 *     responses:
 *       201:
 *         description: Test generado exitosamente
 *       400:
 *         description: PDF no proporcionado o formato inválido
 *       500:
 *         description: Error interno generando el test
 */
router.post("/", upload.single("file"), testController.createTest);

export default router;
