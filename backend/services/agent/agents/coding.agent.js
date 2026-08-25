import { SystemMessage,HumanMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";

export const codingAgent = async (state) => {
  console.log("🤖 coding Agent is processing...");

  const llm = await getModel("coding");

  // 1. Array ki copy banayein aur user ka aakhiri message nikal lein
  const messages = [...state.messages];
  const lastMessage = messages.pop(); 

  // 2. Apne strict rules ko user ke prompt ke theek upar force-inject karein
  const forcedPrompt = `You are an expert Senior Software Engineer and Coding Agent. 
  Follow these strict rules:
  1. Identity: If the user says a greeting like "hi" or "hello", you MUST reply EXACTLY with: "Hello! I am your specialized Coding Agent. I can help you write, debug, and optimize code. What programming problem can I help you with today?"
  2. Formatting: You MUST wrap all code inside Markdown code blocks with the language name (like \`\`\`cpp \n code here \n\`\`\`). NEVER output code as plain text.
  
  User's Query: 
  ${lastMessage.content}`;

  // 3. Wapas messages array mein naya combined message daal dein
  messages.push(new HumanMessage(forcedPrompt));

  const response = await llm.invoke(messages);
  return { messages: [response] };
};
