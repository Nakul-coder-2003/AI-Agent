import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Plus, LogOut, Coins, Bot } from 'lucide-react'; // Icons

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-white">
      
      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        
        {/* Sidebar Top: New Chat Button */}
        <div className="p-4">
          <button className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Sidebar Middle: Chat History (Dummy for now) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <p className="px-2 text-xs font-semibold text-gray-500 uppercase">Recent Chats</p>
          
          {/* Dummy Chat Item */}
          <button className="flex items-center w-full gap-3 px-3 py-2 text-sm text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-200">
            <MessageSquare size={16} className="text-gray-500" />
            <span className="truncate">React Frontend Help</span>
          </button>
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
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-blue-600" />
            <h1 className="text-lg font-semibold text-gray-800">AI RAG Agent</h1>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
            <Coins size={16} />
            {/* Dummy credits for now, will connect to payment service later */}
            <span className="text-sm font-bold">100 Credits</span>
          </div>
        </header>

        {/* Chat Area: Welcome Screen */}
        <main className="flex-1 p-6 overflow-y-auto bg-white flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-50 rounded-full">
                <Bot size={48} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.firstName || user?.userName}!</h2>
            <p className="text-gray-500">
              I am your AI Assistant. I can help you with coding, PDF analysis (RAG), searching the web, and generating images.
            </p>
          </div>
        </main>

        {/* Input Area (Bottom) */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Message your AI Agent..." 
                className="w-full py-3 pl-4 pr-12 text-gray-700 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button className="absolute right-2 p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <MessageSquare size={16} />
              </button>
            </div>
            <p className="mt-2 text-xs text-center text-gray-400">
              AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;