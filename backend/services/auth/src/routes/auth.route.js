import express from "express";
import { uploadFile } from "../middlewares/mullter.middleware.js";
import { login, logout, signup } from "../controllers/auth.controllers.js";
const authRouter = express.Router();

authRouter.post("/signup",uploadFile.single("profileImg"),signup);
authRouter.post("/login",login);
authRouter.post("/logout",logout);
authRouter.get("/getuser",(req,res)=>{
    return res.json("hello users")
})

export default authRouter;