
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatBubble = ({ msg, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(
    msg.sender === 'user' || !isLatest ? msg.text : ''
  );

  useEffect(() => {
    if (msg.sender === 'user' || !isLatest) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(msg.text.slice(0, i));
      i++;
      if (i > msg.text.length) {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [msg.text, isLatest, msg.sender]);

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