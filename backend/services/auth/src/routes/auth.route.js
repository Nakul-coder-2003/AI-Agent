import express from "express";
import { uploadFile } from "../middlewares/mullter.middleware.js";
import { login, logout, signup } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);

export default authRouter;