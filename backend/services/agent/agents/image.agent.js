import {DallEAPIWrapper} from "@langchain/openai"
import { getModel } from "../config/llmModels.js";
export const imageAgent = async (state) => {
    console.log("👁️ Image Agent is processing...");

    const messages = state.messages;
    const lastMessage = messages[messages.length - 1].content;

    const isGenerateRequest = lastMessage.toLowerCase().includes("generate") || 
                              lastMessage.toLowerCase().includes("create") || 
                              lastMessage.toLowerCase().includes("draw")
    

    if (isGenerateRequest) {
        console.log("🎨 Action: Generating Image using DALL-E...");
        
        // DALL-E Tool setup
        const tool = new DallEAPIWrapper({
            n: 1, // Kitni images banani hai
            model: "dall-e-3", // OpenAI ka best image model
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const imageUrl = await tool.invoke(lastMessage);
        
        // State mein image ka URL wapas bhejenge
        return { messages: [new SystemMessage(`Here is the generated image URL: ${imageUrl}`)] };
    }
    else{
        console.log("🔍 Action: Analyzing Image using Vision Model...");
        
        const llm = await getModel("image"); 
        const systemPrompt = "You are an expert image analyzer. Describe the image in detail or answer the user's question about it.";
        
        // Frontend se Base64 image aane par data kuch is tarah bheja jata hai:
        const response = await llm.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage({
                content: [
                    { type: "text", text: lastMessage },
                    // { type: "image_url", image_url: { url: "data:image/jpeg;base64,....." } } <-- Future mein yahan actual image data aayega
                ]
            })
        ]);
        
        return { messages: [response] };
    }                   
}

