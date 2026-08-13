import express from "express"
import { agentController } from "../controllers/agent.controller.js";

const agentRoute = express.Router();

agentRoute.post("/chat",agentController);

export default agentRoute;