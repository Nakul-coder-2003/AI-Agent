import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

export const openAiModel = new ChatOpenAI({
    openAIApiKey:process.env.OPENAI_API_KEY,
    model: "openai:gpt-5.5",
    temperature: 0.2
})


export const genAiModel = new ChatGoogleGenerativeAI({
    GoogleApiKey:process.env.GOOGLE_API_KEY,
    model: "gemini-2.5-pro",
    temperature: 0.2
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return geminiModel; // General chat ke liye Gemini fast aur sasta hai
        case "search":
            return geminiModel;
        case "coding":
            return openAiModel; // Coding aur logical tasks mein OpenAI zyada badiya hota hai
        case "imageAnalyzer":
            return geminiModel; // Gemini vision tasks ke liye best hai
        default:
            return geminiModel; // Fallback
    }
};