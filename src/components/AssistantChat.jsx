import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles, Zap, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './AssistantChat.css';

const AssistantChat = () => {
  const { isChatOpen, setIsChatOpen, userProfile, startupProfile } = useAppContext();
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Welcome to the Skill2Earn Intelligence Hub. I'm here to provide real-time career guidance and ecosystem insights. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [messages, isChatOpen, isTyping]);

  const generateResponse = (text) => {
    const query = text.toLowerCase();
    
    if (query.includes('hello') || query.includes('hi')) return "Greetings! I'm your autonomous assistant. How can I help you grow today?";
    if (query.includes('score') || query.includes('rank')) {
      return `Your skill score is ${userProfile?.score || 0}. To reach the next level, I recommend focusing on the 'Generative AI Foundations' course in the Learning Hub.`;
    }
    if (query.includes('startup')) return "Our ecosystem supports founders with feasibility analysis and investor matching. You can submit your pitch in the Entrepreneur portal.";
    if (query.includes('job') || query.includes('work')) return "Check the Opportunity Feed. We match Elite talent with top startups based on skill intelligence scores.";
    
    const fallbacks = [
      "That's an insightful question. From a strategic perspective, leveraging AI tools can significantly boost your output in that area.",
      "I'm analyzing that based on current market trends. The Skill2Earn network is seeing a high demand for precisely what you're asking about.",
      "Great question. I'd recommend exploring our Market Pulse dashboard to see how those trends are evolving in real-time.",
      "I'm here to help with any part of the platform. Whether it's refining your pitch or finding the right skills to learn next, just ask!"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = { role: 'ai', content: generateResponse(input) };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          <motion.div 
            className="chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsChatOpen(false)}
          />
          <motion.div 
            className="chat-drawer glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="chat-header">
              <div className="header-title">
                <Sparkles size={20} className="text-gradient" />
                <span>SX Assistant</span>
              </div>
              <button className="close-btn" onClick={() => setIsChatOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="chat-content">
              <div className="message-list">
                {messages.map((msg, i) => (
                  <div key={i} className={`message-item ${msg.role}`}>
                    <div className="message-avatar">
                      {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className="message-bubble">
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message-item ai">
                    <div className="message-avatar"><Bot size={14} /></div>
                    <div className="message-bubble typing-bubble">
                      <Loader2 size={12} className="animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form className="chat-footer" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistantChat;
