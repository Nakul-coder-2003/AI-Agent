import { HumanMessage,AIMessage } from "@langchain/core/messages";
import graph from "../graph/graph.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

import dotenv from "dotenv"
dotenv.config();

export const agentController = async (req, res) => {
  try {
    //NAYA: req.body se history bhi nikal lo (default empty array de do)
    const { prompt,history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    console.log(`\n📬 New Prompt received: "${prompt}"`);

    //NAYA: History ko LangChain ke format mein convert karo
    const formattedHistory = history.map(msg => {
        // Chat service se 'user' ya 'model' aayega
        if (msg.role === 'user') {
            return new HumanMessage(msg.parts);
        } else {
            return new AIMessage(msg.parts);
        }
    });

    // 3. Purani saari baatein aur tumhara naya sawal ek array mein combine karo
    const allMessages = [...formattedHistory, new HumanMessage(prompt)];

    const result = await graph.invoke({
      messages: allMessages
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
    
    const blob = new Blob([req.file.buffer], { type: 'application/pdf' });
    console.log(blob);

    // 2. LangChain loader se PDF load karna
    const loader = new WebPDFLoader(blob);
    const rawDocs = await loader.load();

    if (!rawDocs || rawDocs.length === 0) {
       return res.status(400).json({ error: "Could not extract text from this PDF." });
    }

    // 2. Text ko chote tukdo (Chunks) mein todna
    // Ek bada PDF direct DB mein nahi jata, uske 1000 characters ke chunks banaye jate hain
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200, // Thoda overlap taaki context break na ho
    });
    const docs = await splitter.splitDocuments(rawDocs);

    console.log(
      `✂️ PDF split into ${docs.length} chunks. Generating Embeddings...`,
    );

    // FIX 1: PDF se aane wale ajeeb characters (null bytes) ko hatana aur chote chunks ko filter karna
    const validDocs = docs.map(doc => {
      // \0 (null characters) ko hata rahe hain
      doc.pageContent = doc.pageContent.replace(/\0/g, '').trim();
      return doc;
    }).filter(doc => doc.pageContent.length > 5); // Sirf wahi chunks rakho jisme actual meaning ho

    console.log(`🧹 Cleaned docs count: ${validDocs.length}`);

    if (validDocs.length === 0) {
       return res.status(400).json({ error: "PDF text is empty or invalid after cleaning." });
    }

    // 3. Supabase aur Gemini Embeddings Setup
    const client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PRIVATE_KEY,
    );

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: "gemini-embedding-001",
    });

    // FIX 2: Supabase ko bhejne se pehle Gemini API ka ek chota sa Test
    try {
      console.log("🧪 Testing Gemini Embedding API...");
      const testVector = await embeddings.embedQuery("Test");
      console.log(`✅ Gemini working! Vector length: ${testVector?.length}`); 
    } catch (e) {
      console.error("❌ Gemini API Error:", e);
      return res.status(500).json({ error: "Gemini API failed to generate embeddings." });
    }

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
