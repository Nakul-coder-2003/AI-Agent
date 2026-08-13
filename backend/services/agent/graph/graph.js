import {START,END,StateGraph}  from "@langchain/langgraph"
import AgentState from "./state.js"
import router from "./router.js";

//import all agents
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { imageAgent } from "../agents/image.agent.js";
import { pdfRagAgent } from "../agents/pdfRag.agent.js";

// 1. Graph Initialize karna (State ke blueprint ke sath)
const builder = new StateGraph(AgentState);

// add nodes in graph
builder.addNode("chat",chatAgent);
builder.addNode("coding",codingAgent);
builder.addNode("search",searchAgent);
builder.addNode("image",imageAgent);
builder.addNode("pdfRag",pdfRagAgent)

builder.addConditionalEdges(START,router,{
    "chat": "chat",
    "coding" : "coding",
    "search" : "search",
    "image":"image",
    "pdfRag":"pdfRag"
})

builder.addEdge("chat",END);
builder.addEdge("coding",END);
builder.addEdge("search",END);
builder.addEdge("image",END);
builder.addEdge("pdfRag",END);

const graph = builder.compile();

export default graph;