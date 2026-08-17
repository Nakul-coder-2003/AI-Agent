import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ek user ka sirf ek hi wallet hoga
  },
  balance: {
    type: Number,
    default: 100, // Sign up bonus: 100 free credits
  },
},{timestamps:true});

export const creditModel = mongoose.model("Credit",creditSchema);