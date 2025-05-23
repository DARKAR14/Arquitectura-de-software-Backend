import { Router } from "express";
import { getTestResults } from "../controllers/result.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Endpoints para guardar resultados de tests
 */

/**
 * @swagger
 * /results:
 *   post:
 *     summary: Guardar el resultado de un test
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testId
 *               - score
 *               - answers
 *             properties:
 *               testId:
 *                 type: string
 *                 description: ID del test realizado
 *               score:
 *                 type: number
 *                 description: Puntaje obtenido
 *               answers:
 *                 type: array
 *                 description: Respuestas del usuario
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedOption:
 *                       type: string
 *     responses:
 *       201:
 *         description: Resultado guardado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.get("/:id", verifyToken, getTestResults);

export default router;
