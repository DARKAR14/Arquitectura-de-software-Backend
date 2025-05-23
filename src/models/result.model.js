import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  user: { // Cambiar de userId a user para consistencia
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: { // Cambiar de testId a test
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  answers: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    selectedOption: {
      type: String,
      enum: ["A", "B", "C", "D"]
    }
  }],
  score: {
    type: Number,
    required: true,
  },
  total: { // Nuevo campo para porcentaje
    type: Number,
    required: true
  }
}, {
  timestamps: true,
});

export default mongoose.model("Result", resultSchema);
