import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",      // Referencia al modelo de Usuario
    required: true,   // Es obligatorio asociar un usuario
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: String, // Puedes almacenar el texto o el ID de la pregunta
    }
  ],
}, {
  timestamps: true,
});

export default mongoose.model("Test", testSchema);
