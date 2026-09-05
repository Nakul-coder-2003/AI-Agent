import crypto from "crypto"
globalThis.crypto = crypto;
import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./src/config/database.js";
import chatRouter from "./src/router/chat.router.js";

dotenv.config();

const app = express();

app.use(express.json());


app.get("/api/chat", (req, res) => {
  res.status(200).json({
    message: "chat Service is up and running!",
  });
});

app.use("/api/chat", chatRouter);

const PORT = Number(process.env.PORT) || 8003;

const startServer = async () => {
  try {
    await ConnectDB();
    app.listen(PORT, () => {
      console.log(`chat Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
