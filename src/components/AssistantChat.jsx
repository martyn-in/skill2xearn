import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './AssistantChat.css';

const AssistantChat = () => {
  const { isChatOpen, setIsChatOpen, t } = useAppContext();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your SX AI Assistant. How can I help you navigate the Skill2Earn ecosystem today?' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulated AI response logic
    setTimeout(() => {
      let response = "I'm still learning about that! Try asking about 'investors', 'startups', or 'how to improve my score'.";
      const query = input.toLowerCase();

      if (query.includes('investor')) {
        response = "The Investor Radar shows startups that have been officially funded. You can find it in the sidebar!";
      } else if (query.includes('startup') || query.includes('found')) {
        response = "Founders can pitch their ideas in the Entrepreneur Portal. We evaluate them from Level 1 to 3.";
      } else if (query.includes('score') || query.includes('skill')) {
        response = "You can improve your Skill Readiness Score by completing recommended learning tracks in the Learning Hub.";
      } else if (query.includes('help') || query.includes('tour')) {
        response = "Welcome! Skill2Earn X is an economic growth engine. You can find jobs, pitch startups, or invest in vetted talent.";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
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

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message-wrapper ${msg.role}`}>
                  <div className="message-icon">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-content">
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn" onClick={handleSend}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AssistantChat;
