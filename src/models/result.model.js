import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model("Result", resultSchema);
