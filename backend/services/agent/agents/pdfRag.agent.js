import { getModel } from "../config/llmModels.js";
import {GoogleGenerativeAIEmbeddings} from "@langchain/google-genai"
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv"
dotenv.config();

export const pdfRagAgent = async (state) => {
    console.log("📄 PDF RAG Agent is searching the database...");

    const messages = state.messages;
    const lastMessage = messages[messages.length - 1].content;

    // 1. Supabase Client Setup
    const client = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PRIVATE_KEY
    );

    // 2. Embeddings Setup (Text ko numbers mein convert karne ki machine)
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        modelName: "gemini-embedding-001", // Gemini ka latest embedding model
    });

    // 3. Vector DB se connection banayenge
    const vectorStore = new SupabaseVectorStore(embeddings, {
        client,
        tableName: "documents", // Supabase mein table ka naam
        queryName: "match_documents", // Supabase ka search function
    });

    const searchResults = await vectorStore.similaritySearch(lastMessage, 3);

    // Result ko ek single string mein jodna
    const contextText = searchResults.map(doc => doc.pageContent).join("\n\n");

    const llm = await getModel("chat");

    const systemPrompt = `You are a helpful assistant. Use ONLY the following context to answer the user's question. 
    If you cannot find the answer in the context, just say "I don't know based on the provided document". Do not make up information.
    
    CONTEXT FROM PDF:
    ${contextText}`;

    const response = await llm.invoke([
        new SystemMessage(systemPrompt),
        messages[messages.length - 1]
    ]);
    
    return { messages: [response] };
}