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


export const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers } = req.body;

    // Validar formato de answers
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Formato de respuestas inválido" });
    }

    const test = await Test.findById(testId)
      .populate({
        path: "questions",
        select: "correctAnswer _id"
      })
      .orFail(() => new Error("Test no encontrado"));

    // Validar propiedad
    if (test.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Filtrar y validar cada respuesta
    let score = 0;
    const validAnswers = answers
      .map(answer => {
        // Validar campos requeridos
        if (!answer.questionId || !answer.selectedOption) return null;
        
        // Buscar pregunta
        const question = test.questions.find(q => 
          q._id.toString() === answer.questionId.toString()
        );
        if (!question) return null;

        // Validar formato de selectedOption
        if (!["A", "B", "C", "D"].includes(answer.selectedOption.toUpperCase())) {
          return null;
        }

        const isCorrect = question.correctAnswer === answer.selectedOption.toUpperCase();
        if (isCorrect) score++;

        return {
          questionId: question._id,
          selectedOption: answer.selectedOption.toUpperCase(),
          isCorrect
        };
      })
      .filter(Boolean); // Eliminar respuestas inválidas

    // Crear resultado
    const result = new Result({
      user: req.user.id,
      test: testId,
      score,
      total: test.questions.length,
      answers: validAnswers.map(a => ({
        question: a.questionId,
        selectedOption: a.selectedOption,
        isCorrect: a.isCorrect
      }))
    });

    await result.save();

    res.json({
      score,
      total: test.questions.length,
      percentage: ((score / test.questions.length) * 100).toFixed(2) + "%",
      details: validAnswers
    });

  } catch (error) {
    console.error("Error en submitTest:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate({
        path: 'test',
        select: 'topic difficulty createdAt',
        populate: {
          path: 'questions',
          select: 'text correctAnswer'
        }
      })
      .sort({ createdAt: -1 });

    const formattedResults = results.map(result => ({
      _id: result._id,
      score: result.score,
      total: result.total,
      percentage: ((result.score / result.total) * 100).toFixed(2) + "%",
      test: {
        topic: result.test.topic,
        difficulty: result.test.difficulty,
        date: result.test.createdAt
      },
      details: result.answers.map(answer => ({
        question: answer.question.text,
        correctAnswer: answer.question.correctAnswer,
        userAnswer: answer.selectedOption,
        isCorrect: answer.isCorrect
      }))
    }));

    res.json({ results: formattedResults });

  } catch (error) {
    console.error("Error en getUserResults:", error);
    res.status(500).json({ error: "Error obteniendo historial" });
  }
};