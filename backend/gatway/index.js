import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";
import cors from "cors";

const app = express();
dotenv.config();
const PORT = process.env.PORT;
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors());

app.use("/auth",proxy(process.env.AUTH_SERVER_URL,{
    proxyReqPathResolver: (req) => {
        return "/auth" + req.url;
    }
}))

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello backend gatway server")
})

app.listen(PORT,()=>{
    console.log(`backend gatway server is running on ${PORT}`)
})