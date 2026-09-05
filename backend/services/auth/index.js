import crypto from "crypto";
globalThis.crypto = crypto;
import express from "express"
import dotenv from "dotenv"
import ConnectDB from "./src/config/db.js";
import { globalErrorHandler } from "./src/middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);


app.use(globalErrorHandler);

app.listen(PORT,()=>{
    ConnectDB();
    console.log(`backend auth server is running on ${PORT}`);
})
