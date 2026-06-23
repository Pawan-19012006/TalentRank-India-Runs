import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, FileText, Bot } from 'lucide-react';

const Copilot = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi Jane. I am your Recruiter Copilot. You can ask me to find specific candidate profiles, analyze the talent pool, or explain my ranking decisions.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = { role: 'user', content: input };
    const newMsgs = [...messages, userMessage];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponseContent = '';
      let reasoningTokens = null;

      setMessages(msgs => [...msgs, { role: 'ai', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                aiResponseContent += data.content;
                setMessages(msgs => {
                  const updated = [...msgs];
                  updated[updated.length - 1].content = aiResponseContent;
                  return updated;
                });
              }
              if (data.reasoningTokens !== undefined) {
                reasoningTokens = data.reasoningTokens;
                setMessages(msgs => {
                  const updated = [...msgs];
                  updated[updated.length - 1].reasoningTokens = reasoningTokens;
                  return updated;
                });
              }
              if (data.error) {
                console.error('API Error:', data.error);
              }
            } catch (e) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => [...msgs, { role: 'ai', content: 'Sorry, I encountered an error connecting to the AI.' }]);
    } finally {
      setIsTyping(false);
    }
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
              {msg.content || (msg.role === 'ai' && <span className="animate-pulse">...</span>)}
              {msg.reasoningTokens !== undefined && (
                <div className="mt-2 text-xs text-textMuted border-t border-border pt-2">
                  <Sparkles size={12} className="inline mr-1 text-primary" />
                  Reasoning tokens: {msg.reasoningTokens}
                </div>
              )}
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
            disabled={!input.trim() || isTyping}
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
