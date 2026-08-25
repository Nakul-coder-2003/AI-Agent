import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ msg, isLatest }) => {
  // Shuru mein khali string rakhein
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // FIX 3: Agar user ka message hai ya history load hui hai, toh turant pura text dikhao
    if (msg.sender === 'user' || !isLatest) {
      setDisplayedText(msg.text);
      return;
    }

    // AI ka naya message aane par hi typewriter chalao
    let i = 0;
    setDisplayedText(""); // Naya animation shuru hone se pehle purana text clean karo
    const interval = setInterval(() => {
      setDisplayedText(msg.text.slice(0, i + 1));
      i++;
      if (i >= msg.text.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [msg.text, isLatest, msg.sender]); // Dependency array mein msg.text add kiya hai taaki text badalte hi UI update ho

  return (
    <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[75%] p-4 rounded-2xl ${
          msg.sender === 'user' 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {msg.sender === 'user' ? (
          <p>{displayedText}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-blue">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    // 1. Dark Mode Code Block
                    <div className="overflow-hidden border border-gray-700 rounded-lg my-4">
                      {/* Language header (e.g., cpp, python) */}
                      <div className="bg-gray-800 text-gray-400 px-4 py-1.5 text-xs font-mono uppercase border-b border-gray-700">
                        {match[1]}
                      </div>
                      {/* Actual Code */}
                      <pre className="bg-gray-900 p-4 overflow-x-auto text-gray-100 text-sm font-mono m-0">
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    </div>
                  ) : (
                    // 2. Inline Code (Light red/gray style)
                    <code className="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {displayedText}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;