// src/controllers/test.controller.js
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { HfInference } from "@huggingface/inference";
import Test from "../models/test.model.js";
import Question from "../models/question.model.js";

const hfClient = new HfInference(process.env.HF_API_KEY);


const generateTestTitle = (filename) => {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9áéíóúñü\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());
};
// Función para parsear la respuesta de la IA
const parseAIQuestions = (aiOutput) => {
  const questionBlocks = aiOutput.split(/(?:\d+[.)]|Pregunta|PREGUNTA)/gi); // Más flexible
  const parsedQuestions = [];

  questionBlocks.forEach((block) => {
    const lines = block.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 6) return;

    // Extraer texto de pregunta (permite múltiples líneas)
    const questionText = lines[0].replace(/^\d+[.)]\s*/, '').trim();

    // Extraer opciones con diferentes formatos (A), A., A-, etc.)
    const options = lines.slice(1, 5).map(line => {
      const match = line.match(/^([A-D])[)\-.]?\s*(.+)/i);
      return match ? { letter: match[1].toUpperCase(), text: match[2].trim() } : null;
    }).filter(opt => opt);

    // Extraer respuesta correcta (busca en todo el bloque)
    const correctAnswerLine = lines.find(line => line.match(/correcta:\s*([A-D])/i));
    const correctAnswer = correctAnswerLine?.match(/correcta:\s*([A-D])/i)?.[1]?.toUpperCase();

    if (questionText && options.length === 4 && correctAnswer) {
      parsedQuestions.push({
        text: questionText,
        options,
        correctAnswer,
        type: "multiple-choice"
      });
    }
  });

  return parsedQuestions;
};

export const createTest = async (req, res) => {
  try {
    const { difficulty } = req.body;
    const file = req.file;
    
    if (!req.body.difficulty) {
      return res.status(400).json({ error: "El campo 'difficulty' es requerido" });
    }

    if (!file || file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: "Debe proporcionar un archivo PDF válido" });
    }

    // Procesar PDF
    const pdfBuffer = file.buffer;
    const { text: pdfText } = await pdfParse(pdfBuffer);

    // Generar preguntas con IA
    const prompt = `Genera 5 preguntas de opción múltiple en español (formato 1. Pregunta... A) ... B) ... etc.) 
    con dificultad ${difficulty} basadas en este texto. Incluye la respuesta correcta al final de cada pregunta.
    Texto: ${pdfText.substring(0, 2500)}`; // Limitar texto por tokens

    let aiOutput = "";
    const stream = hfClient.chatCompletionStream({
      model: "deepseek-ai/DeepSeek-R1",
      messages: [{ role: "user", content: prompt }],
      provider: "novita",
      max_tokens: 1500,
    });

    for await (const chunk of stream) {
      aiOutput += chunk.choices[0]?.delta?.content || "";
    }

    // Parsear y validar preguntas
    const questionsData = parseAIQuestions(aiOutput);
    if (questionsData.length < 5) {
      throw new Error(`Solo se generaron ${questionsData.length} preguntas válidas`);
    }

    // Crear test y preguntas
    const newTest = new Test({
  user: req.user.id,
  topic: generateTestTitle(file.originalname),
  difficulty,
  source: "pdf",
  generatedFrom: file.originalname
});

    const createdQuestions = await Promise.all(
      questionsData.map(async (qData) => {
        const question = new Question({
          ...qData,
          test: newTest._id,
          user: req.user.id
        });
        await question.save();
        return question._id;
      })
    );

    newTest.questions = createdQuestions;
    await newTest.save();

    // Obtener test con preguntas (sin respuestas)
    const testWithQuestions = await Test.findById(newTest._id)
      .populate({
        path: 'questions',
        select: 'text options type'
      })
      .lean();

    res.status(201).json({
      success: true,
      test: {
        ...testWithQuestions,
        pdfMeta: {
          originalName: file.originalname,
          size: file.size,
          pages: pdfText.split('\f').length // Estimación de páginas
        }
      }
    });

  } catch (error) {
    console.error("Error en createTest:", error);
    res.status(500).json({
      success: false,
      error: "Error generando test",
      details: error.message
    });
  }
};

export const getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate({
        path: 'questions',
        select: 'text options type' // Excluye respuestas e ID de preguntas
      })
      .lean();

    if (!test) return res.status(404).json({ error: "Test no encontrado" });
    if (test.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "No tienes acceso a este test" });
    }

    res.json({
      ...test,
      questions: test.questions.map(q => ({
        ...q,
        // Opcional: Ordenar opciones alfabéticamente
        options: q.options.sort((a, b) => a.letter.localeCompare(b.letter))
      }))
    });

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo test" });
  }
};

export const getUserTests = async (req, res) => {
  try {
    const tests = await Test.find({ user: req.user.id })
      .select("topic difficulty createdAt generatedFrom")
      .lean();

    res.json(tests.map(test => ({
      id: test._id,
      topic: test.topic,
      difficulty: test.difficulty,
      createdAt: test.createdAt,
      source: test.generatedFrom
    })));

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo tests" });
  }
};