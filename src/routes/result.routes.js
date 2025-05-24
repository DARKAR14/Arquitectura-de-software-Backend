import { Router } from "express";
import * as resultController from "../controllers/result.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Endpoints para guardar resultados de tests
 */
router.get("/result", verifyToken, resultController.getUserResults);
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
router.get("/:id", verifyToken, resultController.getTestResults);
/**
 * @swagger
 * /results/{testId}:
 *   post:
 *     summary: Enviar respuestas de un test
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         description: ID del test
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     selectedAnswer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Respuestas enviadas exitosamente
 */
router.post("/:testId/submit", verifyToken, resultController.submitTest);

export default router;
