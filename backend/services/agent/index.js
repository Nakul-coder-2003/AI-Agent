import crypto from "crypto";
globalThis.crypto = crypto;
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import agentRoute from "./routes/agent.route.js";

const app = express();
dotenv.config();

//middleware
app.use(express.json());
app.use(cors());

app.get('/api/agent', (req, res) => {
    res.status(200).json({ 
        message: "Agent Service is up and running!",
    });
});

app.use("/api/agent",agentRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Agent Service running on port ${PORT}`);
});

