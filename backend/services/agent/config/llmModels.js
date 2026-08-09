import { ChatOpenAI } from "@langchain/openai";

const openAiModel = new ChatOpenAI({
    openAIApiKey:process.env.OPENAI_API_KEY,
    model: "openai:gpt-5.5",
    temperature: 0.2
})