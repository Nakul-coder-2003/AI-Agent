import { HumanMessage } from "@langchain/core/messages";
import graph from "../graph/graph.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

import dotenv from "dotenv"
dotenv.config();

export const agentController = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    console.log(`\n📬 New Prompt received: "${prompt}"`);

    const result = await graph.invoke({
      messages: [new HumanMessage(prompt)],
    });

    const finalMessage = result.messages[result.messages.length - 1].content;

    res.status(200).json({
      success: true,
      reply: finalMessage,
      // fullState: result // Pura state dekhne ke liye (Debugging mein kaam aayega)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong in Agent service" });
  }
};

export const pdfUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    console.log("📄 PDF Received, starting extraction...");

    // 1. PDF se Text nikalna
    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    // 2. Text ko chote tukdo (Chunks) mein todna
    // Ek bada PDF direct DB mein nahi jata, uske 1000 characters ke chunks banaye jate hain
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200, // Thoda overlap taaki context break na ho
    });
    const docs = await splitter.createDocuments([rawText]);

    console.log(
      `✂️ PDF split into ${docs.length} chunks. Generating Embeddings...`,
    );

    // 3. Supabase aur Gemini Embeddings Setup
    const client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PRIVATE_KEY,
    );

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "text-embedding-004",
    });

    // 4. Vector DB (Supabase) mein save karna
    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });

    console.log("✅ PDF successfully processed and saved to database!");

    res.status(200).json({
      success: true,
      message: `PDF processed and ${docs.length} chunks saved to database.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};
