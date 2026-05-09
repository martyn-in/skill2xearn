import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Zap, Star, Rocket, Briefcase, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Matchmaker.css';

const Matchmaker = () => {
  const { allStartups, userProfile } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [history, setHistory] = useState([]);

  // Filter startups that are hiring and not already applied/matched
  const candidates = (allStartups || []).filter(s => s.isHiring);

  const handleSwipe = (dir) => {
    setDirection(dir);
    setHistory([...history, { ...candidates[currentIndex], action: dir }]);
    
    setTimeout(() => {
      setDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  if (currentIndex >= candidates.length) {
    return (
      <div className="matchmaker-empty glass-panel">
        <Rocket size={48} className="animate-bounce" />
        <h3>You've seen everyone!</h3>
        <p>Check back later for more startup matches.</p>
        <button className="btn-primary" onClick={() => setCurrentIndex(0)}>Reset Stack</button>
      </div>
    );
  }

  const current = candidates[currentIndex];

  return (
    <div className="matchmaker-container">
      <div className="matchmaker-header">
        <div>
          <h2>Smart Matchmaker</h2>
          <p>AI-powered talent-startup discovery</p>
        </div>
        <div className="match-score">
          <Star size={14} />
          <span>{90 + Math.floor(Math.random() * 10)}% Match</span>
        </div>
      </div>

      <div className="card-stack">
        <AnimatePresence mode="wait">
          <motion.div
            key={current._id || currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: direction === 'right' ? 200 : direction === 'left' ? -200 : 0,
              rotate: direction === 'right' ? 20 : direction === 'left' ? -20 : 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="match-card glass-panel"
          >
            <div className="card-image">
              <div className="image-placeholder">
                <Rocket size={60} />
              </div>
              <div className="card-badge">HIRING: {current.hiringRole}</div>
            </div>

            <div className="card-info">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{current.title}</h3>
                <div className="location-tag"><MapPin size={12} /> Remote</div>
              </div>
              <p className="card-description">{current.description || "Leading the next wave of digital innovation. Join our mission to scale globally."}</p>
              
              <div className="card-stats">
                <div className="stat">
                  <span>FEASIBILITY</span>
                  <strong>{current.feasibility}%</strong>
                </div>
                <div className="stat">
                  <span>EQUITY</span>
                  <strong>0.5% - 2%</strong>
                </div>
              </div>

              <div className="tech-stack">
                {['React', 'AI', 'Node.js'].map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>
            </div>

            <div className="card-actions">
              <button className="swipe-btn reject" onClick={() => handleSwipe('left')}>
                <X size={24} />
              </button>
              <button className="swipe-btn super" onClick={() => alert("Super Match Sent!")}>
                <Zap size={20} />
              </button>
              <button className="swipe-btn accept" onClick={() => handleSwipe('right')}>
                <Heart size={24} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Matchmaker;
