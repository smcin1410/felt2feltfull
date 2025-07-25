import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

const GroupChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sender, setSender] = useState('You');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input) return;
    setMessages([
      ...messages,
      {
        id: 'msg-' + Date.now(),
        sender,
        text: input,
        timestamp: Date.now(),
      },
    ]);
    setInput('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100 max-h-[350px] overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Group Chat</h3>
      <div className="max-h-[180px] overflow-y-auto bg-gray-800 p-2 rounded mb-3">
        {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <strong className="text-blue-300">{msg.sender}:</strong> <span className="text-gray-100">{msg.text}</span>
            <span className="text-gray-400 text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="mb-2">
        <label className="block mb-1">
          Name:
          <input
            type="text"
            value={sender}
            onChange={e => setSender(e.target.value)}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-32"
          />
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white mr-2"
          placeholder="Type a message..."
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default GroupChat; 