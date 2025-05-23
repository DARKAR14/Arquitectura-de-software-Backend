import Result from "../models/result.model.js";
import Test from "../models/test.model.js";

export const getTestResults = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate({
        path: 'test',
        populate: {
          path: 'questions',
          select: 'text correctAnswer'
        }
      });

    if (!result) return res.status(404).json({ error: "Resultado no encontrado" });
    if (result.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const detailedResults = result.answers.map(ans => ({
      question: ans.question.text,
      correctAnswer: ans.question.correctAnswer,
      userAnswer: ans.selectedOption,
      isCorrect: ans.isCorrect
    }));

    res.json({
      score: result.score,
      total: result.total,
      percentage: ((result.score / result.total) * 100).toFixed(2) + "%",
      details: detailedResults
    });

  } catch (error) {
    console.error("Error en getTestResults:", error);
    res.status(500).json({ error: "Error obteniendo resultados" });
  }
};