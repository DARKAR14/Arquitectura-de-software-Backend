import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  letter: { // Cambiar de 'text' a 'letter' para coincidir con A/B/C/D
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  text: {
    type: String,
    required: true,
  }
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
  options: [optionSchema],
  correctAnswer: { // Mover la respuesta correcta aquí
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true
  },
  test: { // Referencia al test padre
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true
  }
}, {
  timestamps: true,
});

export default mongoose.model("Question", questionSchema);
