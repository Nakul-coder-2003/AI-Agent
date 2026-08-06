import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

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