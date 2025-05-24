import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true // Mantenemos la referencia válida
    },
    selectedOption: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true // 👈 Añadir required
    },
    isCorrect: {
      type: Boolean,
      required: true // 👈 Campo faltante
    }
  }],
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Result", resultSchema);