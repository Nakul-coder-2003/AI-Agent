const { Annotation } = require("@langchain/langgraph");
const { BaseMessage } = require("@langchain/core/messages");

const AgentState = Annotation.Root({
    messages: Annotation({
        reducer: (currState,newMessage) => {
            return currState.concat(newMessage);
        },
        default: () => []
    })
})

export default AgentState;