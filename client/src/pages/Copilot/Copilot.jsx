import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, User, FileText, Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useRanking } from '../../store/rankingStore';

const Copilot = () => {
  const location = useLocation();
  const { candidates } = useRanking();
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

  const generateAIResponse = (userText, currentMsgs) => {
    setTimeout(() => {
      let aiResponse = "I'm sorry, I couldn't find a match for that query or candidate. Could you clarify if you're looking for a specific candidate name or skill?";
      const lowerInput = userText.toLowerCase();
      
      const matchedCandidate = candidates.find(c => 
        lowerInput.includes(c.name.toLowerCase()) || 
        (lowerInput.split(' ').some(word => word.length > 2 && c.name.toLowerCase().includes(word)))
      );

      if (matchedCandidate) {
        const rank = candidates.findIndex(c => c.id === matchedCandidate.id) + 1;
        aiResponse = `Yes, I found ${matchedCandidate.name}. They are currently ranked #${rank} with a match score of ${matchedCandidate.score}%. They are a ${matchedCandidate.role} based in ${matchedCandidate.loc}.`;
      } else if (lowerInput.includes('rag') || lowerInput.includes('healthcare')) {
        aiResponse = "I found 12 candidates with strong RAG experience in the Healthcare domain. The top match is John Doe. Would you like me to add him to your shortlist?";
      } else if (lowerInput.includes('30 days') || lowerInput.includes('notice period')) {
        aiResponse = "Filtering the top 50 candidates, there are 8 individuals who can join within 30 days. Sarah Smith is ranked highest among them with a score of 91%.";
      } else if (lowerInput.includes('why') && lowerInput.includes('above')) {
        aiResponse = "Candidate A is ranked above Candidate B primarily because A has 2 more years of production experience deploying LLMs, and a significantly higher leadership score (9/10 vs 6/10), which carries a 20% weight in your current search configuration.";
      } else if (lowerInput.includes('experience')) {
        aiResponse = `This candidate has a very strong profile. They have relevant production experience matching the core skills for this role, along with high behavioral markers.`;
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        aiResponse = "Hello! How can I help you analyze your candidates today?";
      }

      setMessages([...currentMsgs, { role: 'ai', content: aiResponse }]);
    }, 1000);
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
    if (!input.trim()) return;
    
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
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 border-t border-border shrink-0">
        {messages.length === 1 && (
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
            placeholder="Ask me anything about your candidates or search..." 
            className="w-full pl-4 pr-12 py-3 bg-white border border-border text-black rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-textMuted shadow-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
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
