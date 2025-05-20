// src/controllers/test.controller.js
import { HfInference } from "@huggingface/inference";
import Test from "../models/test.model.js"; // Asegúrate de tener el modelo Test actualizado con el campo 'user'

const hfClient = new HfInference(process.env.HF_API_KEY);

export const createTest = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const prompt = `lo que me vas a responder debe ser en ESPAÑOL, Genera una lista numerada de 5 preguntas de opción múltiple en español sobre ${topic} con dificultad ${difficulty}. Cada pregunta debe estar numerada (1, 2, 3, 4, 5), incluir 4 opciones (A, B, C, D) y al final de cada pregunta indicar la respuesta correcta, sin mostrar ningún proceso de razonamiento, ni cadena de pensamiento. Solo entrega la respuesta final en español.`;

    let output = "";
    const stream = hfClient.chatCompletionStream({
      model: "deepseek-ai/DeepSeek-R1",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      provider: "novita",
      max_tokens: 500,
    });

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices.length > 0) {
        const newContent = chunk.choices[0].delta.content;
        output += newContent;
        console.log(newContent);
      }
    }

    // Guarda el test en la base de datos, asociándolo al usuario autenticado
    // Se asume que el middleware de autenticación ha definido req.user.id
    const newTest = new Test({
      user: req.user.id,
      topic,
      difficulty,
      questions: output.split('\n').filter(line => line.trim() !== "")
    });

    await newTest.save();

    return res.status(201).json({
      message: "Test generado exitosamente",
      test: output,
    });
  } catch (error) {
    console.error("Error generando test:", error);
    return res.status(500).json({
      error: "Error generando test",
      details: error.message,
    });
  }
};


/**
 * GET /tests
 * Devuelve los tests creados por el usuario autenticado.
 */
export const listUserTests = async (req, res) => {
  try {
    // Solo traemos los campos necesarios
    const tests = await Test.find({ user: req.user.id })
      .select("_id topic difficulty createdAt questions")
      .lean();

    // Para no enviar todas las preguntas completas, podemos devolver solo el conteo
    const summary = tests.map(t => ({
      id: t._id,
      topic: t.topic,
      difficulty: t.difficulty,
      createdAt: t.createdAt,
      questionCount: t.questions.length
    }));

    return res.json({ tests: summary });
  } catch (error) {
    console.error("Error listando tests:", error);
    return res.status(500).json({ error: "Error interno listando tests" });
  }
};