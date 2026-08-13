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

  const systemPrompt = `You are a helpful research assistant. Use the following live web search results to answer the user's question accurately. 
    If the answer is not in the search results, just use your own knowledge but mention that it's not from the live search.
    
    LIVE SEARCH RESULTS: 
    ${resultString}`;
  
  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    messages[messages.length - 1]
  ])

  return {messages : [response]};
};
