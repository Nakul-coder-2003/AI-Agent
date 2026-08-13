import { getModel } from "../config/llmModels.js";
import { SystemMessage } from "@langchain/core/messages";

const router = async (state) => {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1];

  const llm = await getModel("chat");

  const systemPrompt = `You are a smart intelligent router. Your only job is to route the user's query to the correct specialized agent.
    
    Here are the available agents:
    - "coding": Route here if the user is asking to write, debug, explain, or generate code.
    - "imageAnalyzer": Route here if the user's input implies analyzing or understanding an image.
    - "search": Route here if the user is asking for real-time information, news, or facts that require web search.
    - "chat": Route here for general conversation, greetings, or anything else that doesn't fit the above.
    
    CRITICAL: You must respond ONLY with the exact single word name of the agent. Do not add any extra punctuation, spaces, or words.`;

    // 4. LLM se pucho ki kahan route karein
    const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        lastMessage
    ]);

    // 5. LLM ka answer clean karna
    const nextAgent = response.content.trim();
    console.log("🚦 Router decided the next agent will be:", nextAgent);

    const validAgents = ["coding", "imageAnalyzer", "search", "chat"];
    if (validAgents.includes(nextAgent)) {
        return nextAgent;
    }

    return "chat";
};

export default router;