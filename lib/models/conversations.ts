import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userMsg: { type: String, required: true },
  filters: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
