import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  MessageSquare,
  Plus,
  LogOut,
  Coins,
  Bot,
  Send,
  Menu,
  PanelLeftClose,
  Trash2,
} from "lucide-react"; // Icons
import axios from "axios";
import ChatBubble from "../components/ChatBubble";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [input, setInput] = useState(""); // Input box ki value
  const [messages, setMessages] = useState([]); // Chat history
  const [isTyping, setIsTyping] = useState(false); // AI ka loading state
  // Sidebar open hai ya nahi
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [credits, setCredits] = useState(0);

  const [conversations, setConversations] = useState([]); // Sidebar list ke liye
  const [activeChatId, setActiveChatId] = useState(null); // Current open chat ka ID

  // API Call: Dashboard load hote hi credits fetch karo
  useEffect(() => {
    const fetchCredit = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/payment/balance",
          {
            withCredentials: true,
          },
        );
        console.log(response.data);
        setCredits(response.data.balance || 0);
      } catch (error) {
        console.error("Failed to fetch credits:", error);
      }
    };
    fetchCredit();
  }, []);

  // API Call: Purani chats ki list laane ke liye
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/chat/conversations",
          {
            withCredentials: true,
          },
        );

        setConversations(response.data.conversations || []);
      } catch (error) {
        console.log("error in fetchConversation", error);
      }
    };
    fetchConversation();
  }, []);

  // Function 1: New Chat shuru karna
  const handleNewChat = () => {
    setMessages([]); // Screen clear
    setActiveChatId(null); // Koi purani chat select nahi hai
  };

  // Function 2: Purani chat par click karke uske messages laana
  const loadConversation = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/chat/${chatId}/messages`,
        {
          withCredentials: true,
        },
      );
      // console.log(response.data.messages)
      // console.log(response.data)

      const formattedMessages = (response.data.messages || []).map((msg) => ({
        // Agar backend 'content' ya 'message' bhejta hai, toh use 'text' bana do
        text: msg.text || msg.content || msg.message || "",
        // Agar backend 'role' bhejta hai (user/assistant), toh use 'sender' bana do
        sender: msg.sender || (msg.role === "user" ? "user" : "ai"),
      }));

      setMessages(formattedMessages || []);
      setActiveChatId(chatId);
    } catch (error) {
      console.log("error in loadConversation", error);
    }
  };

  // Function 3: Message Bhejne ka Function
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Khali message mat bhejo

    // A. User ka message list mein add karo
    const userMsg = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput(""); // Input box khali karo
    setIsTyping(true); // Loading shuru

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chat/message",
        { prompt: userMsg.text, chatId: activeChatId },
        { withCredentials: true },
      );
      // console.log(response.data.aiMessage.content);

      //AI ka reply list mein add karo
      const aiMsg = {
        text: response.data.aiMessage.content || "Agent responded!",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (response.data.chatId && !activeChatId) {
        setActiveChatId(response.data.chatId);
      }
    } catch (error) {
      console.error("Agent error:", error);
      // Agar error aaye toh UI mein bata do
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error connecting to the agent.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsTyping(false); // Loading khatam
    }
  };

  // Function 4: chat delete ka Function
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Click ko loadConversation trigger karne se rokne ke liye

    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/chat/conversations/${chatId}`,
        {
          withCredentials: true,
        },
      );

      // UI se chat hatao
      setConversations((prev) => prev.filter((c) => c._id !== chatId));

      // Agar wahi chat khuli thi, toh screen clear kar do
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Could not delete chat");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* ================= LEFT SIDEBAR ================= */}
      <div
        className={`flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden border-none"
        }`}
      >
        {/* Sidebar Top: New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Sidebar Middle: Chat History (Dummy for now) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="px-2 text-xs font-semibold text-gray-500 uppercase">
            Recent Chats
          </p>

          {conversations.map((conv) => (
            <div
              key={conv._id}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm transition-colors rounded-lg cursor-pointer ${
                activeChatId === conv._id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => loadConversation(conv._id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare
                  size={16}
                  className={
                    activeChatId === conv._id
                      ? "text-blue-600"
                      : "text-gray-500 min-w-4"
                  }
                />
                <span className="truncate">{conv.title || "Conversation"}</span>
              </div>

              {/* NAYA DELETE BUTTON */}
              <button
                onClick={(e) => handleDeleteChat(e, conv._id)}
                className="p-1 text-gray-400 rounded hover:text-red-600 hover:bg-red-50"
                title="Delete Chat"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar Bottom: User Profile & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex items-center justify-center w-8 h-8 text-white bg-blue-500 rounded-full shrink-0">
                {user?.userName?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 truncate">
                {user?.userName}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 transition-colors rounded-lg hover:text-red-600 hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT MAIN AREA ================= */}
      <div className="flex flex-col flex-1">
        {/* Header: Title and Credits */}
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            {/* NAYA BUTTON: Sidebar Toggle karne ke liye */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 transition-colors rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

            <Bot size={24} className="text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-800">
              AI Chat Agent
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
            <Coins size={16} />
            <span className="text-sm font-bold">{credits}</span>
          </div>
        </header>

        {/* Dynamic Chat Area: Welcome Screen */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
          {/* Agar messages zero hain, toh Welcome screen dikhao */}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto">
              <div className="p-4 mb-4 bg-blue-100 rounded-full">
                <Bot size={48} className="text-blue-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Welcome, {user?.firstName || user?.userName}!
              </h2>
              <p className="text-gray-500">
                I am your AI Assistant. Send a message to get started.
              </p>
            </div>
          ) : (
            // Agar messages hain, toh unhe map karke list dikhao
            messages.map((msg, index) => (
              <ChatBubble
                key={index}
                msg={msg}
                isLatest={index === messages.length - 1}
              />
            ))
          )}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 text-gray-500 bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none">
                <span className="animate-pulse">Agent is typing...</span>
              </div>
            </div>
          )}
        </main>

        {/* Dynamic Input Area (Bottom) */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="relative flex items-center">
              {/* Input field ko state se connect kiya */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message your AI Agent..."
                className="w-full py-3 pl-4 pr-12 text-gray-700 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="absolute right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
