import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";
import cors from "cors";
import authenticate from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth",proxy(process.env.AUTH_SERVER_URL,{
    proxyReqPathResolver: (req) => {
        return "/api/auth" + req.url;
    }
}))

app.use("/api/agent",proxy(process.env.AGENT_SERVER_URL,{
    proxyReqPathResolver: (req) => {
        return "/api/agent" + req.url;
    }
}))

app.use("/api/chat",authenticate,proxy(process.env.CHAT_SERVER_URL,{
    proxyReqPathResolver: (req) => {
        return "/api/chat" + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // Agar authenticate middleware ne srcReq.user set kiya hai
        if (srcReq.user) {
            // Apna decoded user ID header mein daal do (check kar lena ki tumhare payload mein id hai ya _id)
            proxyReqOpts.headers['x-user-id'] = srcReq.user.id || srcReq.user._id;
        }
        return proxyReqOpts;
    }
}))

app.use("/api/me",authenticate,getCurrentUser);

app.listen(PORT,()=>{
    console.log(`backend gatway server is running on ${PORT}`)
})