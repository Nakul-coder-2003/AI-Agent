import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

const AgentState = Annotation.Root({
    messages: Annotation({
        reducer: (currState,newMessage) => {
            return currState.concat(newMessage);
        },
        default: () => []
    }),
    agentType: Annotation({
        reducer: (currState, newValue) => newValue ?? currState,
        default: () => "chat"
    })
})

export default AgentState;