import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  source: {
    type: String,
    enum: ["manual", "pdf"],
    default: "pdf"
  },
  generatedFrom: { // Nuevo campo
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Test", testSchema);