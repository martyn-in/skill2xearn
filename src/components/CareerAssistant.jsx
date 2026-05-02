import React, { useState } from 'react';
import { chatMessages } from '../mockData';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './CareerAssistant.css';

const CareerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(chatMessages);
  const [inputVal, setInputVal] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg = { sender: 'user', text: inputVal };
    setMessages([...messages, newMsg]);
    setInputVal('');

    // Dynamic AI Response Logic
    setTimeout(() => {
      const lowerInput = newMsg.text.toLowerCase();
      let aiResponse = "I'm analyzing your request. How else can I assist with your career or startup journey?";

      if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        aiResponse = "Hello! I'm your Skill2Earn Assistant. How can I help you navigate your career or startup goals today?";
      } else if (lowerInput.includes("job") || lowerInput.includes("career")) {
        aiResponse = "Based on market trends, tech and operations roles are in high demand. Make sure to complete your roadmap to reach 'Job Ready' elite status!";
      } else if (lowerInput.includes("startup") || lowerInput.includes("founder") || lowerInput.includes("pitch")) {
        aiResponse = "For startups, focus on clearing Level 1 (Pitch) and Level 2 (Feasibility). I recommend highlighting your market impact to attract investors.";
      } else if (lowerInput.includes("score") || lowerInput.includes("rank") || lowerInput.includes("improve")) {
        aiResponse = "To improve your score, consider adding more certifications in the Dashboard and completing modules in your Learning Roadmap.";
      } else if (lowerInput.includes("invest") || lowerInput.includes("funding")) {
        aiResponse = "Investors are currently looking for high-feasibility, low-risk startups. Make sure your risk score is below 40% before seeking seed funding.";
      } else if (lowerInput.includes("skill") || lowerInput.includes("learn")) {
        aiResponse = "The most demanded skills right now are AI, Data Analysis, and Operations. Check the 'Learning' tab to start building these skills.";
      }

      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiResponse 
      }]);
    }, 1000);
  };

  return (
    <div className="career-assistant-wrapper">
      {!isOpen && (
        <button className="chat-fab btn-primary" onClick={toggleChat}>
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window glass-panel animate-fade-in">
          <div className="chat-header">
            <div className="chat-title">
              <div className="bot-avatar"><Bot size={20} /></div>
              <span>Skill2Earn AI</span>
            </div>
            <button className="close-btn" onClick={toggleChat}><X size={20} /></button>
          </div>

          <div className="chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about your career trajectory..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="send-btn">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CareerAssistant;
