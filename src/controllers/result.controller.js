// src/controllers/result.controller.js
import Result from "../models/result.model.js";
import Test from "../models/test.model.js";

/**
 * POST /results
 * Body esperado:
 * {
 *   testId: string,
 *   answers: [
 *     { questionId: string, selectedOption: string },
 *     ...
 *   ]
 * }
 */
export const saveResult = async (req, res) => {
  try {
    const userId = req.user.id;              // Inyectado por verifyToken
    const { testId, answers } = req.body;

    // Validaciones básicas
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "testId y answers son obligatorios" });
    }

    // Traer el test y asegurarnos que pertenece al usuario
    const test = await Test.findOne({ _id: testId, user: userId });
    if (!test) {
      return res.status(404).json({ error: "Test no encontrado o sin permisos" });
    }

    // Calcular puntuación y detalle
    let correctCount = 0;
    const details = answers.map(({ questionId, selectedOption }) => {
      const question = test.questions.id(questionId);
      const isCorrect = question?.correctAnswer === selectedOption;
      if (isCorrect) correctCount++;
      return {
        questionId,
        selectedOption,
        correctAnswer: question?.correctAnswer || null,
        isCorrect,
      };
    });

    // Guardar resultado
    const newResult = new Result({
      user: userId,
      test: testId,
      score: correctCount,
      total: test.questions.length,
      details,
      date: new Date(),
    });
    await newResult.save();

    // Responder con el resumen de la calificación
    return res.status(201).json({
      message: "Resultado guardado exitosamente",
      result: {
        testId,
        score: correctCount,
        total: test.questions.length,
        details,
      },
    });
  } catch (error) {
    console.error("Error guardando resultado:", error);
    return res.status(500).json({ error: "Error interno guardando resultado" });
  }
};
