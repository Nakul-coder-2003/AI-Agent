import { SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  console.log("🤖 coding Agent is processing...");

  const llm = await getModel("coding");

  const systemPrompt = `You are an expert software engineer and data analyst. You specialize in logical building, Data Structures and Algorithms (DSA), Python, and SQL. Provide clean, efficient code and explain the logic clearly step-by-step.`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    ...state.messages
  ])

  return {messages : [response]};
};
