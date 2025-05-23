// src/routes/test.routes.js
import { Router } from "express";
import * as testController from "../controllers/test.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(), // Almacena en memoria
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  }
});

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
 *     // En el comentario Swagger de la ruta
*     responses:
*       201:
*         description: Test generado exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 test:
*                   $ref: '#/components/schemas/Test'
*                 pdfMeta:
*                   type: object
*                   properties:
*                     originalName:
*                       type: string
*                     size:
*                       type: number
*                     pages:
*                       type: number
 */

router.post("/", verifyToken, upload.single("file"), testController.createTest);

// Obtener test por ID (sin respuestas correctas)
router.get("/:id", verifyToken, testController.getTest);

router.get("/", verifyToken, testController.getUserTests);

export default router;
