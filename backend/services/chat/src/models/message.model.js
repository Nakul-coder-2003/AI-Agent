import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    // Role (user ya AI agent)
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    // Actual text ya prompt
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const messageModel = mongoose.model("Message", messageSchema);
