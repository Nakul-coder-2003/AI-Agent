import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title:{
    type:String,
    default: "New Chat"
  }
},{timestamps:true});

export const conversationModel = mongoose.model("Conversation",conversationSchema);

