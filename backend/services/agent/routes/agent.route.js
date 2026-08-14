import express from "express"
import multer from "multer"
import { agentController, pdfUploadController } from "../controllers/agent.controller.js";

// Multer ko memory mein file save karne ke liye setup karo
const upload = multer({ storage: multer.memoryStorage() });

const agentRoute = express.Router();

agentRoute.post("/chat",agentController);
agentRoute.post("/upload-pdf", upload.single('file'), pdfUploadController)

export default agentRoute;