import { SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/llmModels.js";
import { TavilySearch } from "@langchain/tavily";

export const searchAgent = async (state) => {
  console.log("🔍 Search Agent is fetching live data from Tavily...");

  // 1. User ka message nikalna
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1].content;

  // 2. Tavily Tool setup aur search execute karna
  const searchTool = new TavilySearch({ maxResults: 3 });
  const searchResults = await searchTool.invoke({ query: lastMessage });

  const llm = await getModel("search");

  const resultString = JSON.stringify(searchResults);

  const systemPrompt = `You are a highly intelligent Web Search Agent.
    Follow these strict rules:
    1. Identity: If greeted with "hi" or "hello", say: "Hi! I am your Search Agent. Ask me for real-time information, news, or facts!"
    2. Formatting: NEVER just dump raw API data. Always synthesize the information into a clean, easy-to-read format.
    3. Structure: Use bold text for key entities (names, locations, temperatures) and present complex information using clean bullet points. Make it look visually appealing.
    LIVE SEARCH RESULTS: 
    ${resultString}`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    messages[messages.length - 1],
  ]);

  return { messages: [response] };
};
