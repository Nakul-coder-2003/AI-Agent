import express from "express"
import dotenv from "dotenv"

const app = express();
dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello backend gatway server")
})

app.listen(PORT,()=>{
    console.log(`backend gatway server is running on ${PORT}`)
})