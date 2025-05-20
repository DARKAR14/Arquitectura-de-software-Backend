import mongoose from "mongoose";

// Sub-esquema para las opciones de la pregunta
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple-choice", "true-false", "short-answer"],
    default: "multiple-choice",
  },
  options: [optionSchema], // Array de opciones para preguntas de selección múltiple
}, {
  timestamps: true,
});

export default mongoose.model("Question", questionSchema);
