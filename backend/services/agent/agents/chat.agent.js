import { getModel } from "../config/llmModels.js";

export const chatAgent = async(state) => {
    console.log("🤖 Chat Agent is processing...");

    const llm = await getModel("chat");

    const response = await llm.invoke(state.messages);

    return { messages: [response] };
}