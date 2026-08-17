import Stripe from "stripe";
import dotenv from "dotenv"
import { creditModel } from "../models/credit.model.js";
import { transactionModel } from "../models/transaction.model.js";

dotenv.config();

// Stripe initialize karna (Secret Key ke sath)
const stripe = new Stripe(process.env.STRIPE_SECERET_KEY);

// 1. User ka Credit Balance Check Karna
export const getBalance = async(req,res) => {
    try {
        const userId = req.user.id;

        let wallet = await creditModel.findOne({ userId });

        if(!wallet){
            wallet = await creditModel.create({ userId, balance: 100 });
        }

        res.status(200).json({ success: true, balance: wallet.balance });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch balance" });
    }
}

// 2. Stripe Checkout Session Create Karna (Payment Link Generate karna)
export const buyCredits = async (req, res) => {
    try {
        const userId = req.user.id;
        // Frontend se aayega ki user ko kitne ka plan chahiye (Default 100 INR = 500 Credits)
        const { amountInRupees = 100, creditsToGive = 500 } = req.body;

        // Stripe Checkout Session Generate karna
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `AI Agent Credits (${creditsToGive} Credits)`,
                            description: "Buy credits to continue using the AI Agent",
                        },
                        unit_amount: amountInRupees * 100, // Stripe paiso (paise) mein amount leta hai, isliye * 100
                    },
                    quantity: 1,
                },
            ],
            // Payment success hone ke baad frontend kis page par jayega
            success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            // Payment cancel hone par kahan jayega
            cancel_url: `http://localhost:5173/payment-failed`,
        });

        // Database mein ek pending transaction save kar do
        await transactionModel.create({
            userId,
            stripeSessionId: session.id,
            amount: amountInRupees,
            creditsAdded: creditsToGive,
            status: 'pending'
        });

        // Frontend ko Stripe page ka link bhej do
        res.status(200).json({ 
            success: true, 
            paymentUrl: session.url // Frontend is URL par user ko redirect karega
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create payment session" });
    }
}

//3 varify payment
export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        if (!sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        // 1. Stripe se pucho ki kya is session ki payment successful hui?
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ error: "Payment not completed yet" });
        }

        // 2. Database mein pending transaction dhundo
        const transaction = await transactionModel.findOne({ 
            stripeSessionId: sessionId,
            userId: userId 
        });

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Agar transaction pehle se success hai, toh dobara credits mat do (Double tap protection)
        if (transaction.status === 'success') {
            return res.status(200).json({ message: "Payment already verified", creditsAdded: 0 });
        }

        // 3. Transaction ko 'success' mark karo
        transaction.status = 'success';
        await transaction.save();

        // 4. User ke wallet mein credits add karo
        let wallet = await creditModel.findOne({ userId });
        if (!wallet) {
            // Agar pehle se wallet nahi tha (jo ki nahi hona chahiye), toh naya bana do
            wallet = await creditModel.create({ userId, balance: transaction.creditsAdded });
        } else {
            wallet.balance += transaction.creditsAdded;
            await wallet.save();
        }

        res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully",
            newBalance: wallet.balance
        });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: "Failed to verify payment" });
    }
};

//4 credit deduct
export const deductCredit = async (req, res) => {
    try {
       const userId = req.user.id;
       
       const wallet = await creditModel.findOne({ userId });

       if (!wallet) {
            return res.status(403).json({ 
                success: false, 
                error: "No wallet found. Please recharge." 
            });
        }

       if (wallet.balance <= 0) {
            return res.status(403).json({ 
                success: false, 
                error: "Insufficient credits. Please recharge." 
            });
        }

        wallet.balance -= 1;
        await wallet.save();

        res.status(200).json({ 
            success: true, 
            remainingBalance: wallet.balance 
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to deduct credit" });
    }
}