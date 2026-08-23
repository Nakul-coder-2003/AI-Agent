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
            <ReactMarkdown>{displayedText}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;