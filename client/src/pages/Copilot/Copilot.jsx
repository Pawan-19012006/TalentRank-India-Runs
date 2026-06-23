import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, FileText, Bot } from 'lucide-react';

const Copilot = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi Jane. I am your Recruiter Copilot. You can ask me to find specific candidate profiles, analyze the talent pool, or explain my ranking decisions.' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I can certainly help with that. Let me analyze the candidate pool.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('rag') || lowerInput.includes('healthcare')) {
        aiResponse = "I found 12 candidates with strong RAG experience in the Healthcare domain. The top match is John Doe. Would you like me to add him to your shortlist?";
      } else if (lowerInput.includes('30 days') || lowerInput.includes('notice period')) {
        aiResponse = "Filtering the top 50 candidates, there are 8 individuals who can join within 30 days. Sarah Smith is ranked highest among them with a score of 91%.";
      } else if (lowerInput.includes('why') && lowerInput.includes('above')) {
        aiResponse = "Candidate A is ranked above Candidate B primarily because A has 2 more years of production experience deploying LLMs, and a significantly higher leadership score (9/10 vs 6/10), which carries a 20% weight in your current search configuration.";
      }

      setMessages([...newMsgs, { role: 'ai', content: aiResponse }]);
    }, 1000);
  };

  const suggestions = [
    "Find candidates with RAG experience.",
    "Show candidates from healthcare.",
    "Who can join within 30 days?",
    "Why is John Doe ranked #1?"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto border border-border rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="bg-black text-white p-4 flex items-center gap-3 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary relative z-10">
          <Sparkles size={20} />
        </div>
        <div className="relative z-10">
          <h2 className="font-bold">Recruiter Copilot</h2>
          <p className="text-xs text-white/70">Natural Language Recruiting Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/30">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-black text-white' : 'bg-primary text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
              msg.role === 'user' 
                ? 'bg-black text-white rounded-tr-none' 
                : 'bg-white border border-border text-black rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-border shrink-0">
        {messages.length === 1 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-surface border border-border rounded-full text-xs font-medium text-textMuted hover:text-black hover:border-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your candidates or search..." 
            className="w-full pl-4 pr-12 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primaryDark transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
