import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
dotenv.config();

export const grokModel = new ChatGroq({
    grokApiKey:process.env.GROQ_API_KEY,
    model:"openai/gpt-oss-120b",
    temperature:0.2
})

export const genAiModel = new ChatGoogleGenerativeAI({
    GoogleApiKey:process.env.GOOGLE_API_KEY,
    model: "gemini-3.5-flash",
    temperature: 0.2
})

export const getModel = async (agent) => {
    switch (agent) {
        case "chat":
            return genAiModel; // General chat ke liye Gemini fast aur sasta hai
        case "search":
            return grokModel;
        case "coding":
            return grokModel; // Coding aur logical tasks mein OpenAI zyada badiya hota hai
        case "image":
            return grokModel; // Gemini vision tasks ke liye best hai
        case "pdfRag":
            return genAiModel;
        default:
            return grokModel; // Fallback
    }
};
