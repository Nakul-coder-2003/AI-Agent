import { HumanMessage } from "@langchain/core/messages";
import graph from "../graph/graph.js";

export const agentController = async(req,res)=>{
    try {
        const {prompt} = req.body;
        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }
        console.log(`\n📬 New Prompt received: "${prompt}"`);

        const result = await graph.invoke({
            messages:[new HumanMessage(prompt)]
        })

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
}