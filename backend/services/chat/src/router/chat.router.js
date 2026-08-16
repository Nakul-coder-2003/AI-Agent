import express from "express"
import { getConversations, getMessages, sendMessage } from "../controllers/chat.controller.js";
import multer from "multer"
import { extractUser } from "../middleware/headerAuth.js";

const chatRouter = express.Router();

// Multer memory storage setup
const upload = multer({ storage: multer.memoryStorage() });

chatRouter.get("/conversations",extractUser,getConversations);
chatRouter.get("/:conversationId/messages",extractUser,getMessages);
chatRouter.post("/message",extractUser,upload.single('file'),sendMessage);
chatRouter.get("/get",(req,res)=>{
    res.status(200).json({message:"hello chat router"})
})

export default chatRouter;