import express from "express"
import dotenv from "dotenv"
import ConnectPaymentDB from "./src/config/database.js";
import router from "./src/routes/payment.route.js";

const app = express();
dotenv.config();

app.use(express.json());

app.get("/api/payment",(req,res)=>{
    res.send("payment server is running on these route")
})

app.use("/api/payment",router);

const port = process.env.PORT;
app.listen(port,()=>{
    ConnectPaymentDB();
    console.log(`payment server is running on port ${port}`)
})