import express from "express";
import { uploadFile } from "../middlewares/mullter.middleware.js";
import { forgetPassword, getCurrentUser, login, logout, resetPassword, signup, uploadPhoto, verifyOtp } from "../controllers/auth.controllers.js";
import { userAuth } from "../middlewares/userAuth.middleware.js";
const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.post("/forget-password",forgetPassword);
authRouter.post("/verify-otp",verifyOtp);
authRouter.post("/reset-pass",resetPassword);
authRouter.get("/curr-user",userAuth, getCurrentUser);
authRouter.post("/upload-profile",userAuth,uploadFile.single("profileImg"),uploadPhoto);

export default authRouter;