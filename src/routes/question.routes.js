import { Router } from "express";
import * as questionController from "../controllers/question.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Endpoints para gestionar preguntas
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Obtener todas las preguntas disponibles
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de preguntas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   questionText:
 *                     type: string
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                   correctAnswer:
 *                     type: string
 *       401:
 *         description: Token inválido o no enviado
 */
router.get("/", verifyToken, questionController.getQuestions);

export default router;
