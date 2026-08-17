import express from "express";
import { extractUser } from "../middleware/headerAuth.js";
import { buyCredits, deductCredit, getBalance, verifyPayment } from "../controller/payment.controller.js";

const router = express.Router();

router.get("/balance",extractUser,getBalance)
router.post("/buy-credit",extractUser,buyCredits);
router.post("/verify-payment",extractUser,verifyPayment);
router.post("/deduct",extractUser,deductCredit);

export default router;