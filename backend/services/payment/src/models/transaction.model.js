// backend/services/payment/models/transaction.model.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        userId: { 
            type: String, 
            required: true 
        },
        // Stripe se ek unique ID milti hai har payment attempt par
        stripeSessionId: { 
            type: String, 
            required: true 
        },
        // User ne kitne paise diye
        amount: { 
            type: Number, 
            required: true 
        },
        // Un paiso ke badle kitne credits mile
        creditsAdded: { 
            type: Number, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'success', 'failed'], 
            default: 'pending' 
        }
    },
    { 
        timestamps: true 
    }
);

export const transactionModel =  mongoose.model("Transaction", transactionSchema);