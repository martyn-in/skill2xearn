import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Bot, Zap, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import './CareerAssistant.css';

const CareerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your Skill2Earn AI assistant. How can I help you with your career, startup, or skill development today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState('assistant'); // 'assistant' or 'interview'
  const messagesEndRef = useRef(null);
  const { userProfile, startupProfile } = useAppContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleChat = () => setIsOpen(!isOpen);

  const generateResponse = (text) => {
    const query = text.toLowerCase();
    
    if (mode === 'interview') {
      const interviewResponses = [
        "That's a good start. Can you elaborate on the technical architecture you'd use for that?",
        "Interesting. How would you handle a conflict within a high-stakes startup team?",
        "Great point. In a 2026 market, how do you see autonomous agents affecting that specific workflow?",
        "Explain your reasoning behind choosing that specific tech stack over alternatives.",
        "How do you prioritize tasks when everything is a 'priority 1' in a seed-stage venture?"
      ];
      return `[INTERVIEW COACH] ${interviewResponses[Math.floor(Math.random() * interviewResponses.length)]}`;
    }

    // Knowledge Base Responses
    if (query.includes('hello') || query.includes('hi')) {
      return "Hi there! I'm here to help you navigate the Skill2Earn ecosystem. Whether you're looking for a job, building a startup, or analyzing your skills, just let me know!";
    }
    
    if (query.includes('score') || query.includes('rank')) {
      const score = userProfile?.score || 0;
      const rank = userProfile?.rank || 'Beginner';
      return `Your current Skill Intelligence score is ${score} (${rank}). You can improve this by completing certifications or projects in the Learning Hub. I've noticed Elite members often have high scores in AI and Data Analysis.`;
    }

    if (query.includes('job') || query.includes('hiring') || query.includes('work')) {
      return "The Opportunity Feed shows startups currently hiring Elite talent. If your score is above 75, you'll likely be shortlisted automatically for premium roles. I can also help you optimize your resume to get noticed faster!";
    }

    if (query.includes('startup') || query.includes('pitch')) {
      if (startupProfile) {
        return `I've analyzed your venture "${startupProfile.title}". Your current feasibility score is ${startupProfile.feasibility}%. Focus on the "Problem" section of your pitch—investors in 2026 are looking for clear pain-point resolution.`;
      }
      return "You can start your own venture in the Entrepreneur portal. Just submit your pitch, and our autonomous engine will evaluate its feasibility, risk, and market fit.";
    }

    if (query.includes('who are you') || query.includes('what can you do')) {
      return "I'm the Skill2Earn SX-1 Intelligence Assistant. I can analyze your resume, suggest personalized learning roadmaps, evaluate startup pitches, and autonomously match you with the best opportunities in the global talent network.";
    }

    if (query.includes('help')) {
      return "I can assist with: \n1. Career path optimization\n2. Startup pitch refinement\n3. Navigating the Skill Intelligence Hub\n4. Real-time market trend analysis\n\nWhat would you like to explore first?";
    }

    if (query.includes('future') || query.includes('2026') || query.includes('market')) {
      return userProfile?.marketAnalysis || "The 2026 digital economy is driven by autonomous matching and AI-augmented specialized roles. Our platform ensures you're always aligned with these shifting trends.";
    }

    if (query.includes('invest') || query.includes('funding')) {
      return "Investors use our platform to find high-feasibility startups. If you're a founder, a feasibility score above 80% usually triggers an automated notification to relevant capital partners.";
    }

    // Dynamic Context-Aware Fallback
    const fallbacks = [
      "That's a strategic question. Given your current skill profile, I'd suggest looking at how that intersects with autonomous systems.",
      "I'm processing that through our Market Pulse engine. We're seeing a significant uptick in interest regarding that topic this quarter.",
      "To give you the most accurate advice, I'd need to know if you're aiming for an Elite role or looking to scale a new venture. Both are viable paths here.",
      "Interesting! That aligns well with the 'Skill Intelligence' roadmap we've generated for you. Have you checked the latest modules in the Learning Hub?",
      "I'm here to ensure you maximize your economic potential. Whether it's a technical query or a career move, I've got the data to support your decision."
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = { role: 'ai', content: generateResponse(input) };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="career-assistant-wrapper">
      <AnimatePresence>
        {!isOpen && (
          <motion.button 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            className="chat-fab btn-primary" 
            onClick={toggleChat}
          >
            <MessageSquare size={26} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chat-window glass-panel"
          >
            <div className="chat-header">
              <div className="chat-title">
                <div className="bot-avatar">
                  <Sparkles size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.95rem' }}>{mode === 'interview' ? 'Interview Coach' : 'SX Intelligence'}</span>
                  <span style={{ fontSize: '0.65rem', color: mode === 'interview' ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>{mode === 'interview' ? 'TRAINING MODE' : 'AI ONLINE'}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`mode-toggle ${mode === 'interview' ? 'active' : ''}`} 
                  onClick={() => {
                    setMode(mode === 'interview' ? 'assistant' : 'interview');
                    setMessages([{ role: 'ai', content: mode === 'interview' ? "Hello! How can I help you today?" : "Welcome to the Interview Coach. I'll act as a Startup Founder. Ready to begin?" }]);
                  }}
                  title="Switch to Interview Coach"
                >
                  <Zap size={14} />
                </button>
                <button className="close-btn" onClick={toggleChat}><X size={20} /></button>
              </div>
            </div>

            <div className="chat-body">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble-wrapper ${msg.role}`}>
                  <div className="chat-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble-wrapper ai">
                  <div className="chat-bubble typing">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Ask anything..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!input.trim()}>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerAssistant;

