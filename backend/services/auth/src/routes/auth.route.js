import express from "express";
import { uploadFile } from "../middlewares/mullter.middleware.js";
import { forgetPassword, login, logout, resetPassword, signup, verifyOtp } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/forget-password",forgetPassword);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/reset-pass",resetPassword);

export default authRouter;