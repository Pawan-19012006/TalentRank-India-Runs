import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, FileText, Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';
import { copilotService } from '../../services/copilotService';

const Copilot = () => {
  const location = useLocation();
  const { candidates } = useRanking();
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi Jane. I am your Recruiter Copilot. You can ask me to find specific candidate profiles, analyze the talent pool, or explain my ranking decisions.' }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userText, currentMsgs) => {
    setIsSending(true);
    try {
      const result = await copilotService.sendQuery(userText, candidates);
      const reply = result?.response || "I didn't receive a response from the AI Copilot.";
      setMessages([...currentMsgs, { role: 'ai', content: reply }]);
    } catch (err) {
      console.error('Failed to communicate with AI Copilot service:', err);
      setMessages([...currentMsgs, { role: 'ai', content: "I'm sorry, I was unable to connect to the Copilot backend." }]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    // If navigated here with a prompt in state, send it automatically
    if (location.state?.prompt) {
      const initialPrompt = location.state.prompt;
      // Prevent infinite loop by clearing state after reading
      window.history.replaceState({}, document.title);
      
      setMessages(prev => {
        const newMsgs = [...prev, { role: 'user', content: initialPrompt }];
        generateAIResponse(initialPrompt, newMsgs);
        return newMsgs;
      });
    }
  }, [location.state]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');
    generateAIResponse(input, newMsgs);
  };

  const suggestions = [
    "Find candidates with RAG experience.",
    "Show candidates from healthcare.",
    "Who can join within 30 days?",
    "Why is John Doe ranked #1?"
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto border border-border rounded-2xl card-panel overflow-hidden">
      <div className="bg-gray-900 text-white p-4 flex items-center gap-3 shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary relative z-10">
          <Sparkles size={20} />
        </div>
        <div className="relative z-10">
          <h2 className="font-bold text-white">Recruiter Copilot</h2>
          <p className="text-xs text-gray-300">Natural Language Recruiting Assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-gray-200 text-black border border-gray-300' : 'bg-primary text-white shadow-sm'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-gray-100 border border-gray-200 text-black rounded-tr-none' 
                : 'bg-white border border-border text-black rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary text-white shadow-sm">
              <Bot size={16} />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 text-sm bg-white border border-border text-textMuted rounded-tl-none flex items-center gap-2">
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-textMuted rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-border shrink-0">
        {messages.length === 1 && !isSending && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s)}
                className="whitespace-nowrap px-3 py-1.5 bg-white border border-border rounded-full text-xs font-medium text-textMuted hover:text-black hover:border-primary shadow-sm transition-all"
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
            disabled={isSending}
            placeholder="Ask me anything about your candidates or search..." 
            className="w-full pl-4 pr-12 py-3 bg-white border border-border text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-textMuted shadow-sm disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
