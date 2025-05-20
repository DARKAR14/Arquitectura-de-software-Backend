import Question from "../models/question.model.js";

// Obtener preguntas
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo preguntas" });
  }
};
